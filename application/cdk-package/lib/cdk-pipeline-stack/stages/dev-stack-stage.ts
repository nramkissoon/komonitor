import { Construct, StackProps, Stage, StageProps } from "@aws-cdk/core";
import { DevStack, DevStackProps } from "./../../dev-stack/dev-stack";
import { environments } from "../../common/environments";

export class DevStackStage extends Stage {
  public readonly stack: DevStack;

  constructor(scope: Construct, id: string, props: StackProps & DevStackProps) {
    super(scope, id, props);

    const stackProps: DevStackProps = {
      env: environments.dev,
      lambdaCodeBucketName: props.lambdaCodeBucketName,
      uptimeCheckLambdaBucketKey: props.uptimeCheckLambdaBucketKey,
    };

    this.stack = new DevStack(this, "DevStack", stackProps);
  }
}
