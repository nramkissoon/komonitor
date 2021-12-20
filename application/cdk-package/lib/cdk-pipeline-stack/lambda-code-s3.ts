import { BlockPublicAccess, Bucket } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";
import { LAMBDA_CODE_DEV_BUCKET } from "../common/names";

export class LambdaCodeS3 extends Construct {
  public s3: Bucket;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.s3 = new Bucket(this, "LambdaCodeS3Bucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: LAMBDA_CODE_DEV_BUCKET,
      versioned: true,
    });
  }
}
