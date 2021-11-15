export interface Heading {
  level: "h2" | "h3";
  text: string;
  id: string;
}
export interface FrontMatter {
  slug?: string;
  title: string;
  description?: string;
  editUrl?: string;
  version?: string;
  headings?: Heading[];
  readTimeMinutes?: number;
  lastEdited?: {
    date: string;
    author: string;
  };
}
