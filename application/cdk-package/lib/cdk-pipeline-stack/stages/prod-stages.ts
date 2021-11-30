import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { Construct, Environment, Stage } from "@aws-cdk/core";
import { CdkPipeline } from "@aws-cdk/pipelines";
import { environments } from "../../common/environments";
import {
  ALERT_LAMBDA_CODE_KEY,
  JOB_RUNNER_LAMBDA_CODE_KEY,
  LAMBDA_CODE_DEV_BUCKET,
  prodLambdaCodeBucketName,
  prodLambdaName,
  UPTIME_CHECK_LAMBDA_CODE_KEY,
} from "../../common/names";
import {
  CommonStack,
  CommonStackProps,
} from "../../prod-stack-common/common-stack";
import { ProdDdbTables } from "../../prod-us-east-1-stack/dynamo-db-tables";
import {
  ProdUsEast1Stack,
  ProdUsEast1StackProps,
} from "../../prod-us-east-1-stack/prod-us-east-1-stack";
import {
  getNewCopyLambdaCodeToRegionAction,
  getNewProdLambdaCodeDeployAction,
} from "../lambda-code-deploy-action";

export class ProdUsEast1StackStage extends Stage {
  public readonly stack: ProdUsEast1Stack;

  constructor(scope: Construct, id: string, props: ProdUsEast1StackProps) {
    super(scope, id, props);

    this.stack = new ProdUsEast1Stack(this, "ProdUsEast1Stack", {
      ...props,
      env: environments.prodUsEast1,
    });
  }
}

export interface ProdCommonStackStageProps extends CommonStackProps {
  env: Environment;
}

export class ProdCommonStackStage extends Stage {
  public readonly stack: CommonStack;

  constructor(scope: Construct, id: string, props: ProdCommonStackStageProps) {
    super(scope, id, props);

    this.stack = new CommonStack(this, "ProdCommonStack", {
      ...props,
    });
  }
}

export function createProdCommonStage(
  region: string,
  pipeline: CdkPipeline,
  prodTables: ProdDdbTables,
  artifact: codepipeline.Artifact,
  env: Environment,
  scope: Construct
) {
  const prodUsWest1StackStageProps: ProdCommonStackStageProps = {
    env: env,
    lambdaCodeBucketName: LAMBDA_CODE_DEV_BUCKET,
    uptimeLambdaBucketKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
    jobRunnerLambdaBucketKey: JOB_RUNNER_LAMBDA_CODE_KEY,
    alertLambdaBucketKey: ALERT_LAMBDA_CODE_KEY,
    region: region,
    uptimeMonitorStatusTable: prodTables.uptimeMonitorStatusTable,
    uptimeMonitorTableFrequencyGsiName:
      prodTables.uptimeMonitorTableFrequencyGsiName,
    uptimeMonitorTable: prodTables.uptimeMonitorTable,
    alertTable: prodTables.alertTable,
    userTable: prodTables.userTable,
    alertInvocationTable: prodTables.alertInvocationTable,
    alertInvocationTableTimestampLsiName:
      prodTables.alertInvocationTableTimestampLsiName,
  };

  const prodUsWest1StackStage = new ProdCommonStackStage(
    scope,
    "ProdUsWest1StackStage",
    prodUsWest1StackStageProps
  );

  pipeline.addApplicationStage(prodUsWest1StackStage).addActions(
    getNewCopyLambdaCodeToRegionAction({
      name: "CopyLambdaCode",
      region: region,
      sourceBucket: LAMBDA_CODE_DEV_BUCKET,
      sourceArtifact: artifact,
    })
  );

  pipeline.stage("ProdUsWest1StackStage").addAction(
    getNewProdLambdaCodeDeployAction({
      name: "LambdaDeploy",
      sourceArtifact: artifact,
      uptimeLambdaName: prodLambdaName(region, "uptime"),
      jobRunnerLambdaName: prodLambdaName(region, "jobrunner"),
      alertLambdaName: prodLambdaName(region, "alert"),
      codeBucketName: prodLambdaCodeBucketName(region),
      uptimeCodeKey: UPTIME_CHECK_LAMBDA_CODE_KEY,
      jobRunnerCodeKey: JOB_RUNNER_LAMBDA_CODE_KEY,
      alertCodeKey: ALERT_LAMBDA_CODE_KEY,
      region: region,
    })
  );
}
