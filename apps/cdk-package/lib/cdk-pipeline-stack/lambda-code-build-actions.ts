import { BuildEnvironmentVariableType } from "@aws-cdk/aws-codebuild";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import {
  CodeBuildAction,
  ManualApprovalAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { Construct } from "@aws-cdk/core";
import { LambdaCodeBucketProps } from "./../common/types";
import { BuildProjects } from "./build-projects";

export class LambdaCodeBuildActions extends Construct {
  public manualApprovalAction: ManualApprovalAction;
  public uptimeCheckCodeBuildAction: CodeBuildAction;
  public jobRunnerCodeBuildAction: CodeBuildAction;
  public weeklyReportCodeBuildAction: CodeBuildAction;
  public alertCodeBuildAction: CodeBuildAction;
  constructor(
    scope: Construct,
    id: string,
    props: {
      buildProjects: BuildProjects;
      sourceArtifact: Artifact;
      s3Props: LambdaCodeBucketProps;
    }
  ) {
    super(scope, id);

    const { sourceArtifact, buildProjects, s3Props } = props;

    this.manualApprovalAction = new ManualApprovalAction({
      actionName: "Lambda-Build-Manual-Approval",
      runOrder: 1,
    });

    this.uptimeCheckCodeBuildAction = new CodeBuildAction({
      runOrder: 2,
      actionName: "Uptime-Check-Lambda-Build",
      input: sourceArtifact,
      project: buildProjects.uptimeCheckLambdaBuild,
      variablesNamespace: "uptime-lambda-check-build",
      environmentVariables: {
        S3_BUCKET: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.bucketName,
        },
        S3_KEY: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.uptimeCheckLambdaCodeObjectKey,
        },
      },
    });

    this.jobRunnerCodeBuildAction = new CodeBuildAction({
      runOrder: 3,
      actionName: "Job-Runner-Lambda-Build",
      input: sourceArtifact,
      project: buildProjects.jobRunnerLambdaBuild,
      variablesNamespace: "job-runner-build",
      environmentVariables: {
        S3_BUCKET: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.bucketName,
        },
        S3_KEY: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.jobRunnerLambdaCodeObjectKey,
        },
      },
    });

    this.weeklyReportCodeBuildAction = new CodeBuildAction({
      runOrder: 4,
      actionName: "Weekly-Report-Lambda-Build",
      input: sourceArtifact,
      project: buildProjects.weeklyReportLambdaBuild,
      variablesNamespace: "weekly-report-build",
      environmentVariables: {
        S3_BUCKET: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.bucketName,
        },
        S3_KEY: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.weeklyReportLambdaCodeObjectKey,
        },
      },
    });

    this.alertCodeBuildAction = new CodeBuildAction({
      runOrder: 5,
      actionName: "Alert-Lambda-Build",
      input: sourceArtifact,
      project: buildProjects.alertLambdaBuild,
      variablesNamespace: "alert-build",
      environmentVariables: {
        S3_BUCKET: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.bucketName,
        },
        S3_KEY: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: s3Props.alertLambdaCodeObjectKey,
        },
      },
    });
  }
}
