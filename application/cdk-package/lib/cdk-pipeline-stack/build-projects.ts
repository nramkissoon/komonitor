import * as codebuild from "@aws-cdk/aws-codebuild";
import { LinuxBuildImage, BuildSpec } from "@aws-cdk/aws-codebuild";
import { BlockPublicAccess, Bucket } from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

const uptimeCheckBuildSpec = {
  version: "0.2",
  env: {
    "exported-variables": ["ARTIFACTS_PATH", "KEY", "S3_BUCKET"],
  },
  phases: {
    pre_build: {
      commands: ["cd application/uptime-check-lambda", "npx lerna bootstrap"],
    },
    build: {
      commands: [
        "export TODAY=$(date +%Y-%m-%d-%H-%M-%S)",
        "export ARTIFACTS_PATH=s3://$S3_BUCKET/uptime-check-lambda/$TODAY.zip",
        "export KEY=uptime-check-lambda/$TODAY.zip",
        "npm run build",
        "cd dist",
        "zip -r ../package.zip . *",
        "cd ..",
        "aws s3 cp package.zip $ARTIFACTS_PATH",
      ],
    },
  },
};

export class BuildProjects extends cdk.Construct {
  public readonly uptimeCheckLambdaBuild: codebuild.PipelineProject;
  constructor(scope: cdk.Construct, id: string, props: { s3: Bucket }) {
    super(scope, id);

    this.uptimeCheckLambdaBuild = new codebuild.PipelineProject(
      this,
      "uptimeCheckLambdaBuild",
      {
        buildSpec: BuildSpec.fromObjectToYaml(uptimeCheckBuildSpec),
        environment: { buildImage: LinuxBuildImage.STANDARD_5_0 },
      }
    );

    props.s3.grantReadWrite(this.uptimeCheckLambdaBuild);
  }
}
