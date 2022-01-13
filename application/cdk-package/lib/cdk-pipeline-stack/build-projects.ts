import * as codebuild from "@aws-cdk/aws-codebuild";
import { BuildSpec, LinuxBuildImage } from "@aws-cdk/aws-codebuild";
import { Bucket } from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

const uptimeCheckBuildSpec = {
  version: "0.2",
  env: {
    "exported-variables": ["ARTIFACTS_PATH", "S3_BUCKET"],
  },
  phases: {
    pre_build: {
      commands: ["cd application/uptime-check-lambda", "npx lerna bootstrap"],
    },
    build: {
      commands: [
        "export ARTIFACTS_PATH=s3://$S3_BUCKET/$S3_KEY",
        "npm run build",
        "cd dist",
        "zip -r ../package.zip . *",
        "cd ..",
        "aws s3 cp package.zip $ARTIFACTS_PATH",
      ],
    },
  },
};

const jobRunnerBuildSpec = {
  version: "0.2",
  env: {
    "exported-variables": ["ARTIFACTS_PATH", "S3_BUCKET"],
  },
  phases: {
    pre_build: {
      commands: ["cd application/job-runner-lambda", "npx lerna bootstrap"],
    },
    build: {
      commands: [
        "export ARTIFACTS_PATH=s3://$S3_BUCKET/$S3_KEY",
        "npm run build",
        "cd dist",
        "zip -r ../package.zip . *",
        "cd ..",
        "aws s3 cp package.zip $ARTIFACTS_PATH",
      ],
    },
  },
};

const weeklyReportBuildSpec = {
  version: "0.2",
  env: {
    "exported-variables": ["ARTIFACTS_PATH", "S3_BUCKET"],
  },
  phases: {
    pre_build: {
      commands: ["cd application/weekly-report-lambda", "npx lerna bootstrap"],
    },
    build: {
      commands: [
        "export ARTIFACTS_PATH=s3://$S3_BUCKET/$S3_KEY",
        "npm run build",
        "cd dist",
        "zip -r ../package.zip . *",
        "cd ..",
        "aws s3 cp package.zip $ARTIFACTS_PATH",
      ],
    },
  },
};

const alertBuildSpec = {
  version: "0.2",
  env: {
    "exported-variables": ["ARTIFACTS_PATH", "S3_BUCKET"],
  },
  phases: {
    pre_build: {
      commands: ["cd application/alert-lambda", "npx lerna bootstrap"],
    },
    build: {
      commands: [
        "export ARTIFACTS_PATH=s3://$S3_BUCKET/$S3_KEY",
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
  public readonly jobRunnerLambdaBuild: codebuild.PipelineProject;
  public readonly weeklyReportLambdaBuild: codebuild.PipelineProject;
  public readonly alertLambdaBuild: codebuild.PipelineProject;
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

    this.jobRunnerLambdaBuild = new codebuild.PipelineProject(
      this,
      "jobRunnerLambdaBuild",
      {
        buildSpec: BuildSpec.fromObjectToYaml(jobRunnerBuildSpec),
        environment: { buildImage: LinuxBuildImage.STANDARD_5_0 },
      }
    );

    this.weeklyReportLambdaBuild = new codebuild.PipelineProject(
      this,
      "weeklyReportLambdaBuild",
      {
        buildSpec: BuildSpec.fromObjectToYaml(weeklyReportBuildSpec),
        environment: { buildImage: LinuxBuildImage.STANDARD_5_0 },
      }
    );

    this.alertLambdaBuild = new codebuild.PipelineProject(
      this,
      "alertLambdaBuild",
      {
        buildSpec: BuildSpec.fromObjectToYaml(alertBuildSpec),
        environment: { buildImage: LinuxBuildImage.STANDARD_5_0 },
      }
    );

    props.s3.grantReadWrite(this.uptimeCheckLambdaBuild);
    props.s3.grantReadWrite(this.jobRunnerLambdaBuild);
    props.s3.grantReadWrite(this.alertLambdaBuild);
    props.s3.grantReadWrite(this.weeklyReportLambdaBuild);
  }
}
