import { BuildEnvironmentVariableType } from "@aws-cdk/aws-codebuild";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { CodeBuildAction } from "@aws-cdk/aws-codepipeline-actions";
import { LambdaCodeBucketProps } from "./../common/types";
import { Construct } from "@aws-cdk/core";
import { BuildProjects } from "./build-projects";

export class LambdaCodeBuildActions extends Construct {
  public uptimeCheckCodeBuildAction: CodeBuildAction;
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

    this.uptimeCheckCodeBuildAction = new CodeBuildAction({
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
  }
}
