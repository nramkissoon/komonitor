import chalk from "chalk";
import { checkDirExists } from "../utils";
import { stripeCheckoutSubscriptionsPackage } from "./stripe-checkout-subscriptions";

const packageToMethodMap = {
  "stripe-checkout-subscriptions": () => {
    stripeCheckoutSubscriptionsPackage();
  },
};

const checkInProjectRoot = () => {
  try {
    checkDirExists(process.cwd() + "/.hyper-next");
  } catch (err) {
    console.error(
      chalk.red.bold("Error:") +
        chalk.red(
          " Not in a hyper-next project root, cannot initialize new package."
        )
    );
    console.error(
      chalk.yellow.bold("Info: ") +
        chalk.yellow(
          "hyper-next workspace root contains" +
            chalk.blue.bold(" .hyper-next ") +
            "directory..."
        )
    );
    process.exit(1);
  }
};

export const use = async (args: { package: string }) => {
  checkInProjectRoot();

  if (!(args.package in packageToMethodMap)) {
    console.error(
      chalk.red.bold("Error: ") +
        chalk.red(
          `${args.package} is not a valid package. See https://hyper-next.com/docs/cli/use#packages for list of available package names.`
        )
    );
    process.exit(1);
  }

  switch (args.package) {
    case "stripe-checkout-subscriptions":
      const method = packageToMethodMap["stripe-checkout-subscriptions"];
      method.apply(this);

    default:
      break;
  }
};
