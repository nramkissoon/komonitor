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
  prodLambdaName,
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
  createProdCommonStage,
  ProdCommonStackStage,
  ProdCommonStackStageProps,
  ProdUsEast1StackStage,
} from "./stages/prod-stages";

export class CdkPipelineStack extends cdk.Stack {
  public readonly pipeline: CdkPipeline;
  public readonly lambdaCopyPolicy: PolicyStatement;
  public readonly lambdaDeployPolicy: PolicyStatement;

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
        branch: "preview",
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

    // ------------------------------------------------------------------
    // Lambda deploy and copy statements since they were getting copied for each region and meeting pipeline role policy size limit
    this.lambdaCopyPolicy = new PolicyStatement({
      actions: ["s3:*"],
      effect: Effect.ALLOW,
      resources: ["*"],
    });

    this.lambdaDeployPolicy = new PolicyStatement({
      actions: ["lambda:UpdateFunctionCode", "s3:GetObject"],
      effect: Effect.ALLOW,
      resources: ["*"],
    });
    // ------------------------------------------------------------------

    this.pipeline.addApplicationStage(prodUsEast1StackStage).addActions(
      getNewCopyLambdaCodeToRegionAction({
        name: "CopyLambdaCode",
        region: "us-east-1",
        sourceBucket: LAMBDA_CODE_DEV_BUCKET,
        sourceArtifact: sourceArtifact,
        policy: this.lambdaCopyPolicy,
      })
    );

    this.pipeline.stage("ProdUsEast1StackStage").addAction(
      getNewProdLambdaCodeDeployAction({
        name: "LambdaDeploy",
        sourceArtifact: sourceArtifact,
        uptimeLambdaName: prodLambdaName("us-east-1", "uptime"),
        jobRunnerLambdaName: prodLambdaName("us-east-1", "jobrunner"),
        alertLambdaName: prodLambdaName("us-east-1", "alert"),
        codeBucketName: prodLambdaCodeBucketName("us-east-1"),
        uptimeCodeKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
        jobRunnerCodeKey: JOB_RUNNER_LAMBDA_CODE_KEY,
        alertCodeKey: ALERT_LAMBDA_CODE_KEY,
        region: "us-east-1",
        policy: this.lambdaDeployPolicy,
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
      lighthouseJobTable: prodTables.lighthouseJobTable,
      lighthouseJobTableFrequencyGsiName:
        prodTables.lighthouseJobTableFrequencyGsiName,
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
        policy: this.lambdaCopyPolicy,
      })
    );

    this.pipeline.stage("ProdUsWest1StackStage").addAction(
      getNewProdLambdaCodeDeployAction({
        name: "LambdaDeploy",
        sourceArtifact: sourceArtifact,
        uptimeLambdaName: prodLambdaName("us-west-1", "uptime"),
        jobRunnerLambdaName: prodLambdaName("us-west-1", "jobrunner"),
        alertLambdaName: prodLambdaName("us-west-1", "alert"),
        codeBucketName: prodLambdaCodeBucketName("us-west-1"),
        uptimeCodeKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
        jobRunnerCodeKey: JOB_RUNNER_LAMBDA_CODE_KEY,
        alertCodeKey: ALERT_LAMBDA_CODE_KEY,
        region: "us-west-1",
        policy: this.lambdaDeployPolicy,
      })
    );

    //-------------------------------------------------------------------
    // ----------------------------- us-east-2 --------------------------

    createProdCommonStage(
      "us-east-2",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodUsEast2,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- us-west-2 --------------------------

    createProdCommonStage(
      "us-west-2",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodUsWest2,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ap-south-1 -------------------------

    createProdCommonStage(
      "ap-south-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodApSouth1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ap-northeast-1 -------------------------

    createProdCommonStage(
      "ap-northeast-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodApNortheast1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ap-northeast-2 -------------------------

    createProdCommonStage(
      "ap-northeast-2",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodApNortheast2,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ap-northeast-3 -------------------------

    createProdCommonStage(
      "ap-northeast-3",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodApNortheast3,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ap-southeast-1 -------------------------

    createProdCommonStage(
      "ap-southeast-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodApSoutheast1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ap-southeast-2 -------------------------

    createProdCommonStage(
      "ap-southeast-2",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodApSoutheast2,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- ca-central-1 -------------------------

    createProdCommonStage(
      "ca-central-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodCaCentral1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    //----------------------------- eu-central-1 -------------------------

    createProdCommonStage(
      "eu-central-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodEuCentral1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- eu-west-1 -------------------------

    // createProdCommonStage(
    //   "eu-west-1",
    //   this.pipeline,
    //   prodTables,
    //   sourceArtifact,
    //   environments.prodEuWest1,
    //   this.lambdaCopyPolicy,
    //   this.lambdaDeployPolicy,
    //   this
    // );

    // //-------------------------------------------------------------------
    // // ----------------------------- eu-west-2 -------------------------

    // createProdCommonStage(
    //   "eu-west-2",
    //   this.pipeline,
    //   prodTables,
    //   sourceArtifact,
    //   environments.prodEuWest2,
    //   this.lambdaCopyPolicy,
    //   this.lambdaDeployPolicy,
    //   this
    // );

    // //-------------------------------------------------------------------
    // // ----------------------------- eu-west-3 -------------------------

    // createProdCommonStage(
    //   "eu-west-3",
    //   this.pipeline,
    //   prodTables,
    //   sourceArtifact,
    //   environments.prodEuWest3,
    //   this.lambdaCopyPolicy,
    //   this.lambdaDeployPolicy,
    //   this
    // );

    // //-------------------------------------------------------------------
    // // ----------------------------- sa-east-1 -------------------------

    // createProdCommonStage(
    //   "sa-east-1",
    //   this.pipeline,
    //   prodTables,
    //   sourceArtifact,
    //   environments.prodSaEast1,
    //   this.lambdaCopyPolicy,
    //   this.lambdaDeployPolicy,
    //   this
    // );
  }
}
