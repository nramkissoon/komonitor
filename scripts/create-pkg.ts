import nodePlop, { ActionType } from "node-plop";
import shell from "shelljs";

const plop = nodePlop("plop-templates/plopfile.hbs");

interface Answers {
  packageName: string;
  description: string;
  subDir: string;
}

const createPackage = async () => {
  plop.setGenerator("package", {
    description: "Generates a new package.",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: "Enter package name:",
      },
      {
        type: "input",
        name: "description",
        message: "Enter package description:",
      },
      {
        type: "input",
        name: "subDir",
        message: "Enter package sub-directory name:",
      },
    ],
    actions(answers: any) {
      const actions: ActionType[] = [];
      if (!answers) return actions;

      const { packageName, description, subDir } = answers as Answers;
      actions.push({
        type: "addMany",
        templateFiles: "package/**",
        destination: `../packages/${subDir}/{{dashCase packageName}}`,
        base: "package/",
        data: { description, packageName, subDir },
        abortOnFail: true,
      });

      return actions;
    },
  });

  const { runActions, runPrompts } = plop.getGenerator("package");

  const answers = await runPrompts();
  await runActions(answers);
};

const run = async () => {
  await createPackage();
  shell.exec("npm run bootstrap");
};

run();
