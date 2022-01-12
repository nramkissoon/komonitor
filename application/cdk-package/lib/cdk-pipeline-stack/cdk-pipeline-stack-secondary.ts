import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipelineActions from "@aws-cdk/aws-codepipeline-actions";
import {
  ManualApprovalAction,
  S3SourceAction,
  S3Trigger,
} from "@aws-cdk/aws-codepipeline-actions";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { environments } from "../common/environments";
import { ALERT_LAMBDA_CODE_KEY, LAMBDA_CODE_DEV_BUCKET } from "../common/names";
import { ProdDdbTables } from "../prod-us-east-1-stack/dynamo-db-tables";
import { createProdCommonStage } from "./stages/prod-stages";

export class CdkPipelineStackSecondary extends cdk.Stack {
  public readonly pipeline: CdkPipeline;
  public readonly lambdaCopyPolicy: PolicyStatement;
  public readonly lambdaDeployPolicy: PolicyStatement;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: { tables: ProdDdbTables } & cdk.StackProps
  ) {
    super(scope, id, props);

    // Artifacts
    const sourceArtifact = new codepipeline.Artifact();
    const S3sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const gitHubAccessToken =
      cdk.SecretValue.secretsManager("GitHubAccessToken");

    this.pipeline = new CdkPipeline(this, "cdk-pipeline", {
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      sourceAction: new codepipelineActions.GitHubSourceAction({
        actionName: "GitHubSourceActions",
        output: sourceArtifact,
        owner: "nramkissoon",
        branch: "preview",
        repo: "ono",
        trigger: codepipelineActions.GitHubTrigger.WEBHOOK,
        oauthToken: gitHubAccessToken,
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact: sourceArtifact,
        cloudAssemblyArtifact,
        subdirectory: "application/cdk-package",
        installCommand: "npm install",
        buildCommand: "npm run build",
      }),
    });

    this.pipeline.stage("Source").addAction(
      new S3SourceAction({
        actionName: "S3-Source",
        output: S3sourceArtifact,
        bucket: Bucket.fromBucketName(
          this,
          "secondary-lambda-code-bucket",
          LAMBDA_CODE_DEV_BUCKET
        ),
        bucketKey: ALERT_LAMBDA_CODE_KEY, // BECAUSE IT IS THE LAST LAMBDA BUILT
        trigger: S3Trigger.EVENTS,
      })
    );

    // ------------------------------------------------------------------
    // Lambda deploy and copy statements since they were getting copied for each region and meeting pipeline role policy size limit
    this.lambdaCopyPolicy = new PolicyStatement({
      actions: ["s3:*"],
      effect: Effect.ALLOW,
      resources: ["*"],
    });

    this.lambdaDeployPolicy = new PolicyStatement({
      actions: ["lambda:UpdateFunctionCode", "s3:GetObject"],
      effect: Effect.ALLOW,
      resources: ["*"],
    });

    // IMPORTANT!!!! BOOTSTRAP NEW ENVIRONMENT USING `export CDK_NEW_BOOTSTRAP=1` FOR EACH NEW REGION https://docs.aws.amazon.com/cdk/latest/guide/cdk_pipeline.html

    //-----------------PROD us-west-1 -----------------------------------

    const prodTables = props.tables;

    this.pipeline.addStage("PromoteToProduction").addActions(
      new ManualApprovalAction({
        actionName: "Promote-To-Prod-Manual-Approval",
        runOrder: 1,
      })
    );

    //-------------------------------------------------------------------
    //----------------------------- eu-central-1 -------------------------

    createProdCommonStage(
      "eu-central-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodEuCentral1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    // -------------------------------------------------------------------
    // ----------------------------- eu-west-1 -------------------------

    createProdCommonStage(
      "eu-west-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodEuWest1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- eu-west-2 -------------------------

    createProdCommonStage(
      "eu-west-2",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodEuWest2,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- eu-west-3 -------------------------

    createProdCommonStage(
      "eu-west-3",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodEuWest3,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- eu-west-3 -------------------------

    createProdCommonStage(
      "eu-north-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodEuNorth1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );

    //-------------------------------------------------------------------
    // ----------------------------- sa-east-1 -------------------------

    createProdCommonStage(
      "sa-east-1",
      this.pipeline,
      prodTables,
      sourceArtifact,
      environments.prodSaEast1,
      this.lambdaCopyPolicy,
      this.lambdaDeployPolicy,
      this
    );
  }
}
