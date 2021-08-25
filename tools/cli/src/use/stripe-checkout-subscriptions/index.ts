import chalk from "chalk";
import prompts from "prompts";
import { importTemplates } from "./plop-generators";
import {
  addLocalPackageToProject,
  getProjectNameFromPackageJson,
} from "../../utils";

const promptProperties: prompts.PromptObject<string>[] = [
  {
    type: "confirm",
    name: "confirm",
    message:
      "The following API routes will be created:\npages/api/stripe-checkout-session.ts\npages/api/stripe-create-customer-portal.ts\npages/api/stripe-webhooks.ts\nIs this ok?",
  },
];

export const stripeCheckoutSubscriptionsPackage = async () => {
  console.log("Using Stripe Checkout Subscription Package.");
  const confirmation = (await prompts(promptProperties)).confirm;
  if (!confirmation) {
    console.log("Exiting...");
    process.exit(0);
  }
  console.log(chalk.green("Importing templates..."));
  await importTemplates();
  console.log(chalk.green("Templates imported.\n"));

  const project = getProjectNameFromPackageJson();
  console.log("Adding hyper-next packages to package.json...");
  try {
    await addLocalPackageToProject(project, "@hyper-next/stripe");
  } catch (error) {
    console.log(
      chalk.red.bold("Error: ") + chalk.red((error as Error).message)
    );
    process.exit(1);
  }

  console.log(
    chalk.green("Successfully setup Stripe Checkout subscriptions package!")
  );
};
