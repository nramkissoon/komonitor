import * as codebuild from "@aws-cdk/aws-codebuild";
import { LinuxBuildImage, BuildSpec } from "@aws-cdk/aws-codebuild";
import * as cdk from "@aws-cdk/core";

const uptimeCheckBuildSpec = {
  version: "0.2",
  phases: {
    pre_build: {
      commands: ["cd application/types", "npx lerna bootstrap"],
    },
    build: {
      commands: ["npm run build", "cd ../uptime-check-lambda", "npm run build"],
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
        environment: { buildImage: LinuxBuildImage.STANDARD_5_0 },
      }
    );
  }
}
