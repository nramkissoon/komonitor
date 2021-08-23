import { statSync } from "fs";

export const checkFileExists = (path: string) => {
  const statsObj = statSync(path);

  if (statsObj && statsObj.isFile()) return true;
  return false;
};
