import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { ShellScriptAction } from "@aws-cdk/pipelines";
import { prodLambdaCodeBucketName } from "../common/names";

export function getNewCopyLambdaCodeToRegionAction(args: {
  name: string;
  region: string;
  sourceBucket: string;
  sourceArtifact: codepipeline.Artifact;
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
    rolePolicyStatements: [
      new PolicyStatement({
        actions: ["s3:*"],
        effect: Effect.ALLOW,
        resources: ["*"],
      }),
    ],
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
}) {
  return new ShellScriptAction({
    runOrder: 11,
    actionName: args.name,
    commands: [
      `aws lambda update-function-code --function-name ${args.uptimeLambdaName} --s3-bucket ${args.codeBucketName} --s3-key ${args.uptimeCodeKey}`,
      `aws lambda update-function-code --function-name ${args.jobRunnerLambdaName} --s3-bucket ${args.codeBucketName} --s3-key ${args.jobRunnerCodeKey}`,
      `aws lambda update-function-code --function-name ${args.alertLambdaName} --s3-bucket ${args.codeBucketName} --s3-key ${args.alertCodeKey}`,
    ],
    additionalArtifacts: [args.sourceArtifact],
    rolePolicyStatements: [
      new PolicyStatement({
        actions: ["lambda:UpdateFunctionCode", "s3:GetObject"],
        effect: Effect.ALLOW,
        resources: ["*"],
      }),
    ],
  });
}
