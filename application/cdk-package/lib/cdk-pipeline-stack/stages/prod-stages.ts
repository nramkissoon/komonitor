import { Construct, Stage } from "@aws-cdk/core";
import { environments } from "../../common/environments";
import {
  ProdUsEast1Stack,
  ProdUsEast1StackProps,
} from "../../prod-us-east-1-stack/prod-us-east-1-stack";

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
