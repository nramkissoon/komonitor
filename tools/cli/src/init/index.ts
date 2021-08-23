import chalk from "chalk";
import prompts from "prompts";
import { checkFileExists } from "../utils";
import { existsSync, mkdirSync, readdirSync, renameSync } from "fs";
import nodePlop from "node-plop";
import shelljs from "shelljs";

const checkInWorkspaceRoot = () => {
  try {
    checkFileExists(process.cwd() + "/.hyper-next.workspace");
  } catch (err) {
    console.error(
      chalk.red.bold("Error:") +
        chalk.red(
          " Not in a hyper-next workspace root, cannot initialize new project."
        )
    );
    console.error(
      chalk.yellow.bold("Info: ") +
        chalk.yellow(
          "hyper-next workspace root contains" +
            chalk.blue.bold(" .hyper-next.workspace ") +
            "file..."
        )
    );
    process.exit(1);
  }
};

const promptProperties: prompts.PromptObject<string>[] = [
  {
    type: "text",
    name: "appName",
    initial: "my-app",
    message: "Enter a name for your new application",
    validate: (value) =>
      /^[a-zA-Z0-9\-]+$/.test(value)
        ? true
        : "App name must be only letters, numbers, or dashes",
  },
];

const checkAppNameDirectoryExists = (appName: string) => {
  if (!existsSync(process.cwd() + "/" + appName)) {
    try {
      mkdirSync(process.cwd() + "/" + appName);
      console.log(
        chalk.green(
          `\nCreated new directory ${chalk.blue.bold(
            appName
          )} in hyper-next workspace root.`
        )
      );
    } catch (err) {
      console.error(
        chalk.red.bold("Error: ") + chalk.red((err as Error).message)
      );
      console.error(chalk.red("Failed to create new project, exiting..."));
      process.exit(1);
    }
  } else {
    console.error(
      chalk.red.bold("Error: ") +
        chalk.red(
          `Directory with name ${chalk.blue.bold(
            appName
          )} already exists. Cannot overwrite.`
        )
    );
    process.exit(1);
  }
};

const plop = nodePlop(__dirname + "/template/plopfile.hbs");

const createProject = async (appName: string) => {
  try {
    plop.setGenerator("hyper-next project", {
      description: "Generates a hyper-next project",
      prompts: [],
      actions: [
        {
          type: "addMany",
          templateFiles: "project/**/*",
          destination: `${process.cwd()}/${appName}/`,
          base: "project/",
          data: { appName },
          globOptions: { dot: true },
          abortOnFail: true,
        },
        {
          // @ts-ignore
          type: "renameMany",
          templateFiles: `${process.cwd()}/${appName}/**/_*`,
          renamer: (name: string) => `.${name.slice(1)}`,
        },
      ],
    });

    const { runActions, runPrompts } = plop.getGenerator("hyper-next project");

    const answers = await runPrompts();
    await runActions(answers);

    // rename hidden files that start with _ as a template with .
    const files = readdirSync(`${process.cwd()}/${appName}/`);
    for (let file of files) {
      if (/_.*/.test(file)) {
        if (/_gitignore\.hbs/.test(file)) {
          renameSync(
            `${process.cwd()}/${appName}/${file}`,
            `${process.cwd()}/${appName}/.gitignore`
          );
        } else {
          renameSync(
            `${process.cwd()}/${appName}/${file}`,
            `${process.cwd()}/${appName}/.${file.slice(1)}`
          );
        }
      }
    }

    return;
  } catch (err) {
    console.error(
      chalk.red.bold("Error: ") + chalk.red((err as Error).message)
    );
    console.error(chalk.red("Failed to create new project, exiting..."));
    process.exit(1);
  }
};

const installDependencies = (appName: string) => {
  shelljs.cd(`${process.cwd() + "/" + appName}`);
  let { code } = shelljs.exec("npm install");

  if (code !== 0) {
    console.error(
      chalk.red.bold("Error: ") +
        chalk.red("Unable to install project dependencies.")
    );
    process.exit(1);
  }
  shelljs.cd("..");
};

export const init = async (args: any) => {
  console.log(chalk.green("Initializing new hyper-next Next.js project..."));

  checkInWorkspaceRoot();

  const appName = args?.name
    ? args.name
    : (await prompts(promptProperties)).appName;
  if (!appName) {
    console.error(
      chalk.red.bold("Error: ") +
        chalk.red("Application name not provided, exiting...")
    );
    process.exit(1);
  }

  console.log(chalk.green("Nice name!"));
  console.log(chalk.green("Setting up your new project..."));

  checkAppNameDirectoryExists(appName);

  await createProject(appName);

  console.log(chalk.green("Project template code has been created."));
  console.log(chalk.green("Installing Node dependencies..."));

  installDependencies(appName);

  // TODO add name to lerna.json packages and lerna bootstrap

  console.log(chalk.green("Success!"));
  console.log(`You can now cd into ${appName} to begin development!`);
};
