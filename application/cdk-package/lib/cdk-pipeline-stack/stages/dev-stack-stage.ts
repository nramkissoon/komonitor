import { Construct, StackProps, Stage } from "@aws-cdk/core";
import { environments } from "../../common/environments";
import { DevStack, DevStackProps } from "./../../dev-stack/dev-stack";

export class DevStackStage extends Stage {
  public readonly stack: DevStack;

  constructor(scope: Construct, id: string, props: StackProps & DevStackProps) {
    super(scope, id, props);

    const stackProps: DevStackProps = {
      env: environments.dev,
      lambdaCodeBucketName: props.lambdaCodeBucketName,
      uptimeCheckLambdaBucketKey: props.uptimeCheckLambdaBucketKey,
      jobRunnerLambdaBucketKey: props.jobRunnerLambdaBucketKey,
      alertLambdaBucketKey: props.alertLambdaBucketKey,
    };

    this.stack = new DevStack(this, "DevStack", stackProps);
  }
}
