import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula as theme } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const JsonViewer = ({ json }: { json: string }) => {
  return (
    <SyntaxHighlighter
      className="syntaxhighlighter"
      style={{
        ...theme,
        'pre[class*="language-"]': {
          margin: "0 0",
          width: "fit-content",
          fontSize: "14px",
        },
      }}
      showLineNumbers
      language={"json"}
      wrapLines={true}
      wrapLongLines={true}
      // eslint-disable-next-line react/no-children-prop
      children={json}
    />
  );
};
