import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { ShellScriptAction } from "@aws-cdk/pipelines";

export function getNewProdLambdaCodeDeployAction(args: {
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
    actionName: "DevStackLambdaDeploy",
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
