#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DevStack } from "../lib/dev-stack/dev-stack";

const environments = {
  dev: { account: "126258523001", region: "us-east-1" },
};

const app = new cdk.App();

new DevStack(app, "DevStack", { env: environments.dev });
