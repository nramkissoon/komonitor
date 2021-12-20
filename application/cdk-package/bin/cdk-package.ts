#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import "source-map-support/register";
import { CdkPipelineStack } from "../lib/cdk-pipeline-stack/cdk-pipeline-stack";
import { CdkPipelineStackSecondary } from "../lib/cdk-pipeline-stack/cdk-pipeline-stack-secondary";
import { environments } from "../lib/common/environments";

const app = new cdk.App();

const primary = new CdkPipelineStack(app, "CdkPipelineStack", {
  env: environments.cdkPipeline,
});

const secondary = new CdkPipelineStackSecondary(
  app,
  "CdkPipelineStackSecondary",
  {
    env: environments.cdkPipeline,
    tables: primary.prodTables,
    stackName: "CdkPipelineStackSecondary",
  }
);

app.synth();
