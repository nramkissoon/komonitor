import { Construct, StackProps, Stage } from "@aws-cdk/core";
import { DevStack } from "./../../dev-stack/dev-stack";
import { environments } from "../../common/environments";

export class DevStackStage extends Stage {
  public readonly stack: DevStack;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.stack = new DevStack(this, "devStack", { env: environments.dev });
  }
}
