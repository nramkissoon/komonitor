#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./init";

const program = new Command();

program.version("0.0.1");

program
  .command("init")
  .description("Initialize a new hyper-next Next.js project.")
  .option("-n, --name [text]", "Application Name")
  .action((args) => {
    init(args);
  });

program
  .command("use")
  .description("Use a hyper-next package in a hyper-next project.")
  .requiredOption(
    "-p, --package [package name]",
    "Package name. See https://hyper-next.com/docs/cli/use#packages for list of available package names."
  );

program.parse(process.argv);
