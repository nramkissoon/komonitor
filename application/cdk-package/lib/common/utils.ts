import { v4 } from "uuid";

export const createUUID = () => {
  return v4();
};

export const getLambdaCodeObjectKey = (uuid: string, subdir: string) => {
  return `${subdir}/${uuid}.zip`;
};
