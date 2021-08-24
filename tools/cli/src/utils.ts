import { statSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";

export const checkFileExists = (path: string) => {
  const statsObj = statSync(path);

  if (statsObj && statsObj.isFile()) return true;
  return false;
};

export const addPackageToLernaJson = (appName: string) => {
  try {
    const raw = readFileSync(process.cwd() + "/lerna.json").toString();
    const json = JSON.parse(raw);

    json["packages"].push(appName + "/**");
    const newRaw = JSON.stringify(json);

    writeFileSync(process.cwd() + "/lerna.json", newRaw, "utf-8");
  } catch (err) {
    console.warn(
      chalk.yellow.bold("Warning: ") +
        chalk.yellow(
          "Unable to add new project to workspace " +
            chalk.blue.bold("lerna.json ") +
            "file."
        )
    );
  }
};
