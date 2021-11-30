import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipelineActions from "@aws-cdk/aws-codepipeline-actions";
import { ManualApprovalAction } from "@aws-cdk/aws-codepipeline-actions";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import {
  CdkPipeline,
  ShellScriptAction,
  SimpleSynthAction,
} from "@aws-cdk/pipelines";
import { environments } from "../common/environments";
import {
  ALERT_LAMBDA_CODE_KEY,
  DEV_STACK,
  JOB_RUNNER_LAMBDA_CODE_KEY,
  LAMBDA_CODE_DEV_BUCKET,
  prodLambdaCodeBucketName,
  UPTIME_CHECK_LAMBDA_CODE_KEY,
} from "../common/names";
import { BuildProjects } from "./build-projects";
import { LambdaCodeBuildActions } from "./lambda-code-build-actions";
import {
  getNewCopyLambdaCodeToRegionAction,
  getNewProdLambdaCodeDeployAction,
} from "./lambda-code-deploy-action";
import { LambdaCodeS3 } from "./lambda-code-s3";
import { DevStackStage } from "./stages/dev-stack-stage";
import {
  ProdCommonStackStage,
  ProdCommonStackStageProps,
  ProdUsEast1StackStage,
} from "./stages/prod-stages";

export class CdkPipelineStack extends cdk.Stack {
  public readonly pipeline: CdkPipeline;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gitHubAccessToken =
      cdk.SecretValue.secretsManager("GitHubAccessToken");

    // Artifacts
    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    this.pipeline = new CdkPipeline(this, "cdk-pipeline", {
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      sourceAction: new codepipelineActions.GitHubSourceAction({
        actionName: "GitHubSourceActions",
        output: sourceArtifact,
        owner: "nramkissoon",
        branch: "main",
        repo: "ono",
        trigger: codepipelineActions.GitHubTrigger.WEBHOOK,
        oauthToken: gitHubAccessToken,
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact: sourceArtifact,
        cloudAssemblyArtifact,
        subdirectory: "application/cdk-package",
        installCommand: "npm install",
        buildCommand: "npm run build",
      }),
    });

    const lambdaCodeS3 = new LambdaCodeS3(this, "LambdaCodeS3Construct");
    const buildProjects = new BuildProjects(this, "buildProjectsConstruct", {
      s3: lambdaCodeS3.s3,
    });
    const lambdaBuildStage = this.pipeline.addStage("LambdaBuildStage");
    const lambdaCodeBuildActions = new LambdaCodeBuildActions(
      this,
      "LambdaCodeBuildActionsConstruct",
      {
        sourceArtifact: sourceArtifact,
        s3Props: {
          bucketName: LAMBDA_CODE_DEV_BUCKET,
          uptimeCheckLambdaCodeObjectKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
          jobRunnerLambdaCodeObjectKey: JOB_RUNNER_LAMBDA_CODE_KEY,
          alertLambdaCodeObjectKey: ALERT_LAMBDA_CODE_KEY,
        },
        buildProjects: buildProjects,
      }
    );
    lambdaBuildStage.addActions(
      lambdaCodeBuildActions.manualApprovalAction,
      lambdaCodeBuildActions.uptimeCheckCodeBuildAction,
      lambdaCodeBuildActions.jobRunnerCodeBuildAction,
      lambdaCodeBuildActions.lambdaCodeBuildAction
    );

    const devStackStage = new DevStackStage(this, "DevStackStage", {
      lambdaCodeBucketName: LAMBDA_CODE_DEV_BUCKET,
      uptimeCheckLambdaBucketKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
      jobRunnerLambdaBucketKey: JOB_RUNNER_LAMBDA_CODE_KEY,
      alertLambdaBucketKey: ALERT_LAMBDA_CODE_KEY,
    });

    this.pipeline.addApplicationStage(devStackStage).addActions(
      new ShellScriptAction({
        actionName: "DevStackLambdaDeploy",
        commands: [
          `aws lambda update-function-code --function-name ${DEV_STACK.UPTIME_CHECK_LAMBDA} --s3-bucket ${LAMBDA_CODE_DEV_BUCKET} --s3-key ${UPTIME_CHECK_LAMBDA_CODE_KEY}`,
          `aws lambda update-function-code --function-name ${DEV_STACK.JOB_RUNNER_LAMBDA} --s3-bucket ${LAMBDA_CODE_DEV_BUCKET} --s3-key ${JOB_RUNNER_LAMBDA_CODE_KEY}`,
          `aws lambda update-function-code --function-name ${DEV_STACK.ALERT_LAMBDA} --s3-bucket ${LAMBDA_CODE_DEV_BUCKET} --s3-key ${ALERT_LAMBDA_CODE_KEY}`,
        ],
        additionalArtifacts: [sourceArtifact],
        rolePolicyStatements: [
          new PolicyStatement({
            actions: ["lambda:UpdateFunctionCode", "s3:GetObject"],
            effect: Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      })
    );

    this.pipeline.addStage("PromoteToProduction").addActions(
      new ManualApprovalAction({
        actionName: "Promote-To-Prod-Manual-Approval",
        runOrder: 1,
      })
    );

    const prodUsEast1StackStage = new ProdUsEast1StackStage(
      this,
      "ProdUsEast1StackStage",
      {
        lambdaCodeBucketName: LAMBDA_CODE_DEV_BUCKET,
        uptimeCheckLambdaBucketKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
        jobRunnerLambdaBucketKey: JOB_RUNNER_LAMBDA_CODE_KEY,
        alertLambdaBucketKey: ALERT_LAMBDA_CODE_KEY,
      }
    );

    this.pipeline.addApplicationStage(prodUsEast1StackStage).addActions(
      getNewCopyLambdaCodeToRegionAction({
        name: "CopyLambdaCode",
        region: "us-east-1",
        sourceBucket: LAMBDA_CODE_DEV_BUCKET,
        sourceArtifact: sourceArtifact,
      })
    );

    this.pipeline.stage("ProdUsEast1StackStage").addAction(
      getNewProdLambdaCodeDeployAction({
        name: "LambdaDeploy",
        sourceArtifact: sourceArtifact,
        uptimeLambdaName:
          prodUsEast1StackStage.stack.commonConstruct.lambdas.uptimeLambda
            .lambda.functionArn,
        jobRunnerLambdaName:
          prodUsEast1StackStage.stack.commonConstruct.lambdas.jobRunnerLambda
            .lambda.functionArn,
        alertLambdaName:
          prodUsEast1StackStage.stack.commonConstruct.lambdas.alertLambda.lambda
            .functionArn,
        codeBucketName: prodLambdaCodeBucketName("us-east-1"),
        uptimeCodeKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
        jobRunnerCodeKey: JOB_RUNNER_LAMBDA_CODE_KEY,
        alertCodeKey: ALERT_LAMBDA_CODE_KEY,
        region: "us-east-1",
      })
    );

    // IMPORTANT!!!! BOOTSTRAP NEW ENVIRONMENT USING `export CDK_NEW_BOOTSTRAP=1` FOR EACH NEW REGION https://docs.aws.amazon.com/cdk/latest/guide/cdk_pipeline.html

    //-----------------PROD us-west-1 -----------------------------------

    const prodTables = prodUsEast1StackStage.stack.tables;

    const prodUsWest1StackStageProps: ProdCommonStackStageProps = {
      env: environments.prodUsWest1,
      lambdaCodeBucketName: LAMBDA_CODE_DEV_BUCKET,
      uptimeLambdaBucketKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
      jobRunnerLambdaBucketKey: JOB_RUNNER_LAMBDA_CODE_KEY,
      alertLambdaBucketKey: ALERT_LAMBDA_CODE_KEY,
      region: "us-west-1",
      uptimeMonitorStatusTable: prodTables.uptimeMonitorStatusTable,
      uptimeMonitorTableFrequencyGsiName:
        prodTables.uptimeMonitorTableFrequencyGsiName,
      uptimeMonitorTable: prodTables.uptimeMonitorTable,
      alertTable: prodTables.alertTable,
      userTable: prodTables.userTable,
      alertInvocationTable: prodTables.alertInvocationTable,
      alertInvocationTableTimestampLsiName:
        prodTables.alertInvocationTableTimestampLsiName,
    };

    const prodUsWest1StackStage = new ProdCommonStackStage(
      this,
      "ProdUsWest1StackStage",
      prodUsWest1StackStageProps
    );

    this.pipeline.addApplicationStage(prodUsWest1StackStage).addActions(
      getNewCopyLambdaCodeToRegionAction({
        name: "CopyLambdaCode",
        region: "us-west-1",
        sourceBucket: LAMBDA_CODE_DEV_BUCKET,
        sourceArtifact: sourceArtifact,
      })
    );

    this.pipeline.stage("ProdUsWest1StackStage").addAction(
      getNewProdLambdaCodeDeployAction({
        name: "LambdaDeploy",
        sourceArtifact: sourceArtifact,
        uptimeLambdaName:
          prodUsWest1StackStage.stack.commonConstruct.lambdas.uptimeLambda
            .lambda.functionArn,
        jobRunnerLambdaName:
          prodUsWest1StackStage.stack.commonConstruct.lambdas.jobRunnerLambda
            .lambda.functionArn,
        alertLambdaName:
          prodUsWest1StackStage.stack.commonConstruct.lambdas.alertLambda.lambda
            .functionArn,
        codeBucketName: prodLambdaCodeBucketName("us-west-1"),
        uptimeCodeKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
        jobRunnerCodeKey: JOB_RUNNER_LAMBDA_CODE_KEY,
        alertCodeKey: ALERT_LAMBDA_CODE_KEY,
        region: "us-west-1",
      })
    );

    //-------------------------------------------------------------------
  }
}
