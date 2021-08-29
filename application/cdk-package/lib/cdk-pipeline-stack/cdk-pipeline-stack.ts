import * as cdk from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipelineActions from "@aws-cdk/aws-codepipeline-actions";
import { BuildProjects } from "./build-projects";
import { LambdaBuildStage } from "./stages/lambda-build-stage";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { DevStackStage } from "./stages/dev-stack-stage";
import { CodeBuildAction } from "@aws-cdk/aws-codepipeline-actions";

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

    const buildProjects = new BuildProjects(this, "build_projects", {});

    const uptimeCheckLambdaArtifact = new codepipeline.Artifact();

    const lambdaBuildStage = this.pipeline.addStage("Lambda Build");
    lambdaBuildStage.addActions(
      new CodeBuildAction({
        actionName: "Uptime Check Lambda Build",
        input: sourceArtifact,
        project: buildProjects.uptimeCheckLambdaBuild,
        outputs: [uptimeCheckLambdaArtifact],
      })
    );

    const devStackStage = new DevStackStage(this, "devStackStage");
    this.pipeline.addApplicationStage(devStackStage);
  }
}
