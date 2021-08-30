import { Construct, StackProps, Stage } from "@aws-cdk/core";
import { DevStack } from "./../../dev-stack/dev-stack";
import { environments } from "../../common/environments";

export class DevStackStage extends Stage {
  public readonly stack: DevStack;

  constructor(
    scope: Construct,
    id: string,
    props: StackProps & {
      uptimeCheckLambdaBucketName: string;
      uptimeCheckLambdaBucketKey: string;
    }
  ) {
    super(scope, id, props);

    const stackProps = {
      env: environments.dev,
      uptimeCheckLambdaBucketName: props.uptimeCheckLambdaBucketName,
      uptimeCheckLambdaBucketKey: props.uptimeCheckLambdaBucketKey,
    };

    this.stack = new DevStack(this, "devStack", stackProps);
  }
}
