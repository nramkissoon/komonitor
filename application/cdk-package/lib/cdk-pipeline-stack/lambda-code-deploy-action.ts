import { LinuxBuildImage } from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { ShellScriptAction } from "@aws-cdk/pipelines";
import { prodLambdaCodeBucketName } from "../common/names";

export function getNewCopyLambdaCodeToRegionAction(args: {
  name: string;
  region: string;
  sourceBucket: string;
  sourceArtifact: codepipeline.Artifact;
  policy: PolicyStatement;
}) {
  return new ShellScriptAction({
    runOrder: 10,
    actionName: args.name,
    additionalArtifacts: [args.sourceArtifact], // required for no fucking reason
    commands: [
      `aws s3 cp s3://${args.sourceBucket} s3://${prodLambdaCodeBucketName(
        args.region
      )} --recursive --source-region us-east-1 --region ${args.region}`,
    ],
    rolePolicyStatements: [args.policy],
  });
}

export function getNewProdLambdaCodeDeployAction(args: {
  name: string;
  sourceArtifact: codepipeline.Artifact;
  uptimeLambdaName: string;
  jobRunnerLambdaName: string;
  alertLambdaName: string;
  codeBucketName: string;
  uptimeCodeKey: string;
  jobRunnerCodeKey: string;
  alertCodeKey: string;
  policy: PolicyStatement;
  region: string;
}) {
  return new ShellScriptAction({
    environment: {
      buildImage: LinuxBuildImage.STANDARD_5_0,
      environmentVariables: {
        AWS_REGION: {
          value: args.region,
        },
        AWS_DEFAULT_REGION: {
          value: args.region,
        },
      },
    },
    runOrder: 11,
    actionName: args.name,
    commands: [
      `aws lambda update-function-code --function-name ${args.uptimeLambdaName} --s3-bucket ${args.codeBucketName} --s3-key ${args.uptimeCodeKey}`,
      `aws lambda update-function-code --function-name ${args.jobRunnerLambdaName} --s3-bucket ${args.codeBucketName} --s3-key ${args.jobRunnerCodeKey}`,
      `aws lambda update-function-code --function-name ${args.alertLambdaName} --s3-bucket ${args.codeBucketName} --s3-key ${args.alertCodeKey}`,
    ],
    additionalArtifacts: [args.sourceArtifact],
    rolePolicyStatements: [args.policy],
  });
}
