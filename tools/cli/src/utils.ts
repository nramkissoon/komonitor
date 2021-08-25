import { statSync, readFileSync, writeFileSync } from "fs";
import chalk from "chalk";
import shelljs from "shelljs";

export const checkFileExists = (path: string) => {
  const statsObj = statSync(path);

  if (statsObj && statsObj.isFile()) return true;
  return false;
};

export const checkDirExists = (path: string) => {
  const statsObj = statSync(path);

  if (statsObj && statsObj.isDirectory()) return true;
  return false;
};

export const addPackageToLernaJson = (appName: string) => {
  try {
    const raw = readFileSync(process.cwd() + "/lerna.json").toString();
    const json = JSON.parse(raw);

    json["packages"].push(appName + "/**");
    const newRaw = JSON.stringify(json, null, 4);

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

export const getProjectNameFromPackageJson = () => {
  try {
    const raw = readFileSync(process.cwd() + "/package.json").toString();
    return JSON.parse(raw)["name"];
  } catch (error) {
    throw new Error("unable to read name from package.json");
  }
};

export const addLocalPackageToProject = async (
  projectName: string,
  packageName: string
) => {
  const { code } = shelljs.exec(
    `lerna add --scope=${projectName} ${packageName}`
  );

  if (code !== 0) {
    throw new Error(
      `unable to run 'lerna add --scope=${projectName} ${packageName}'`
    );
  }
};
