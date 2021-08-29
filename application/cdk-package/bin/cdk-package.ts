#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CdkPipelineStack } from "../lib/cdk-pipeline-stack/cdk-pipeline-stack";
import { environments } from "../lib/common/environments";

const app = new cdk.App();

new CdkPipelineStack(app, "CdkPipelineStack", {
  env: environments.cdkPipeline,
});

app.synth();
