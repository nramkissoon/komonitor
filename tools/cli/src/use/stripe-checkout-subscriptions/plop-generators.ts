import chalk from "chalk";
import nodePlop, { ActionType } from "node-plop";

const plop = nodePlop(__dirname + "/template/plopfile.hbs");

export const importTemplates = async () => {
  plop.setGenerator("stripe-checkout-subscription", {
    description: "generate a stripe-checkout-subscription integration",
    prompts: [],
    actions: [
      {
        type: "addMany",
        templateFiles: "files/**/*",
        destination: `${process.cwd()}/pages/api/`,
        base: "files/",
        abortOnFail: true,
      },
    ],
  });

  const { runActions, runPrompts } = plop.getGenerator(
    "stripe-checkout-subscription"
  );

  const answers = await runPrompts();
  const { failures } = await runActions(answers);
  if (failures.length > 0) {
    for (let failure of failures) {
      console.error(chalk.red(`Template import error: ${failure.error}`));
    }
    process.exit(1);
  }
};
