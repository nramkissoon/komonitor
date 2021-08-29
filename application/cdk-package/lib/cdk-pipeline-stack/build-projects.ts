import * as codebuild from "@aws-cdk/aws-codebuild";
import { BuildSpec } from "@aws-cdk/aws-codebuild";
import * as cdk from "@aws-cdk/core";

const uptimeCheckBuildSpec = {
  version: "0.2",
  phases: {
    pre_build: {
      commands: ["cd application/uptime-check-lambda", "npm install"],
    },
    build: {
      commands: ["npm run build", "npx cdk synth"],
    },
  },
  artifacts: {
    "base-directory": "application/uptime-check-lambda/dist/",
    files: "**/*",
  },
};

export class BuildProjects extends cdk.Construct {
  public readonly uptimeCheckLambdaBuild: codebuild.PipelineProject;
  constructor(scope: cdk.Construct, id: string, props: {}) {
    super(scope, id);

    this.uptimeCheckLambdaBuild = new codebuild.PipelineProject(
      this,
      "uptimeCheckLambdaBuild",
      {
        buildSpec: BuildSpec.fromObjectToYaml(uptimeCheckBuildSpec),
      }
    );
  }
}
