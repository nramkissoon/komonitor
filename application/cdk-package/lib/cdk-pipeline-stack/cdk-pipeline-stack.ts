import * as cdk from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipelineActions from "@aws-cdk/aws-codepipeline-actions";
import { BuildProjects } from "./build-projects";
import { LambdaBuildStage } from "./stages/lambda-build-stage";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { DevStackStage } from "./stages/dev-stack-stage";
import { BuildEnvironmentVariableType } from "@aws-cdk/aws-codebuild";
import { BlockPublicAccess, Bucket } from "@aws-cdk/aws-s3";
import { LambdaCodeS3 } from "./lambda-code-s3";
import { LambdaCodeBuildActions } from "./lambda-code-build-actions";
import { createUUID, getLambdaCodeObjectKey } from "./../common/utils";

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
    const uuid = createUUID();
    const lambdaBuildStage = this.pipeline.addStage("LambdaBuild");
    const lambdaCodeBuildActions = new LambdaCodeBuildActions(
      this,
      "LambdaCodeBuildActionsConstruct",
      {
        sourceArtifact: sourceArtifact,
        s3Props: {
          bucketName: lambdaCodeS3.s3.bucketName,
          objectKey: getLambdaCodeObjectKey(uuid, "lambda-uptime-check"),
        },
        buildProjects: buildProjects,
      }
    );
    lambdaBuildStage.addActions(
      lambdaCodeBuildActions.uptimeCheckCodeBuildAction
    );

    new cdk.CfnOutput(this, "LambdaCodeBucketCfnOutput", {
      exportName: "lambdaCodeBucketName",
      value: lambdaCodeS3.s3.bucketName,
    });
    // new cdk.CfnOutput(this, "asddd", {
    //   exportName: "key",
    //   value: s3Key,
    // });
    const LambdaBucketCodeName = cdk.Fn.importValue("lambdaCodeBucketName");
    const uptimeCheckLambdaBucketKey = cdk.Fn.importValue("key");

    const devStackStage = new DevStackStage(this, "devStackStage", {
      lambdaCodeBucketName: LambdaBucketCodeName,
      uptimeCheckLambdaBucketKey: getLambdaCodeObjectKey(
        uuid,
        "lambda-uptime-check"
      ),
    });
    this.pipeline.addApplicationStage(devStackStage);
  }
}
