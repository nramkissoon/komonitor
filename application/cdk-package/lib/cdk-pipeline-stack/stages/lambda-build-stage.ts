import { Construct, StackProps, Stage } from "@aws-cdk/core";
import { environments } from "../../common/environments";

export class LambdaBuildStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
