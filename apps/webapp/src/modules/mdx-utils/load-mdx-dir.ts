//https://github.com/chakra-ui/chakra-ui/blob/main/website/src/utils/load-mdx-dir.ts

import path from "path";
import shell from "shelljs";
import { loadMdx } from "./load-mdx";

async function loadMdxDir(mdxDir: string) {
  const dir = path.join(process.cwd(), `pages/${mdxDir}`);
  const filenames = shell.ls("-R", `${dir}/**/*.mdx`);

  const dataPromise = filenames.map(async (filename) => loadMdx(filename));

  const data = await Promise.all(dataPromise);

  return data;
}

export default loadMdxDir;
