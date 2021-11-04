import { parseMarkdownString } from "@docusaurus/utils";
import * as fs from "fs";
import * as path from "path";
import { calcReadTime } from "./calc-read-time";
import { processFrontmatter, serializeMdx } from "./utils";

export async function loadMdx(filename: string) {
  // get the `pages` directory
  const pagesDir = path.join(process.cwd(), "pages");

  // gets the relative mdx path
  // pages/docs/guides.mdx => /docs/guides.mdx
  const relativeFilePath = path.relative(pagesDir, filename);

  const filePath = path.resolve(filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `can't load MDX file ${filename} in ${filePath} does not exist`
    );
  }

  const mdxContent = fs.readFileSync(filePath).toString();

  // extract frontmatter and content from markdown string
  const { source: mdxSource, frontMatter } = await serializeMdx(mdxContent);

  const { excerpt } = parseMarkdownString(mdxContent);

  // extends frontmatter with more useful information
  return processFrontmatter({
    //baseEditUrl: siteConfig.repo.editUrl,
    excerpt: frontMatter.excerpt || excerpt,
    readTimeMinutes: calcReadTime(mdxContent),
    mdxContent,
    ...frontMatter,
    path: relativeFilePath,
    mdxSource,
  });
}
