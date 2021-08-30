import * as cdk from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipelineActions from "@aws-cdk/aws-codepipeline-actions";
import { BuildProjects } from "./build-projects";
import { LambdaBuildStage } from "./stages/lambda-build-stage";
import {
  CdkPipeline,
  ShellScriptAction,
  SimpleSynthAction,
} from "@aws-cdk/pipelines";
import { DevStackStage } from "./stages/dev-stack-stage";
import { BuildEnvironmentVariableType } from "@aws-cdk/aws-codebuild";
import { BlockPublicAccess, Bucket } from "@aws-cdk/aws-s3";
import { LambdaCodeS3 } from "./lambda-code-s3";
import { LambdaCodeBuildActions } from "./lambda-code-build-actions";
import { createUUID, getLambdaCodeObjectKey } from "./../common/utils";
import { Function } from "@aws-cdk/aws-lambda";
import {
  DEV_STACK,
  LAMBDA_CODE_BUCKET,
  UPTIME_CHECK_LAMBDA_CODE_KEY,
} from "../common/names";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";

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
          bucketName: LAMBDA_CODE_BUCKET,
          uptimeCheckLambdaCodeObjectKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
        },
        buildProjects: buildProjects,
      }
    );
    lambdaBuildStage.addActions(
      lambdaCodeBuildActions.uptimeCheckCodeBuildAction
    );

    const devStackStage = new DevStackStage(this, "DevStackStage", {
      lambdaCodeBucketName: LAMBDA_CODE_BUCKET,
      uptimeCheckLambdaBucketKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
    });

    this.pipeline.addApplicationStage(devStackStage).addActions(
      new ShellScriptAction({
        actionName: "DevStackLambdaDeploy",
        commands: [
          `aws lambda update-function-code --function-name ${DEV_STACK.UPTIME_CHECK_LAMBDA} --s3-bucket ${LAMBDA_CODE_BUCKET} --s3-key ${UPTIME_CHECK_LAMBDA_CODE_KEY}`,
        ],
        additionalArtifacts: [sourceArtifact],
        rolePolicyStatements: [
          new PolicyStatement({
            actions: ["lambda:UpdateFunctionCode"],
            effect: Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      })
    );
  }
}
