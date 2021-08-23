#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./init";

const program = new Command();

program.version("0.0.1");

program
  .command("init")
  .description("Initialize a new hyper-next Next.js project.")
  .option("-n, --name [value]", "Application Name")
  .action((args) => {
    init(args);
  });

program.parse(process.argv);
