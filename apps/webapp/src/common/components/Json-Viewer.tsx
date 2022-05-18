import { Button } from "@chakra-ui/react";
import React from "react";
import { FiClipboard } from "react-icons/fi";
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

export const JSONCopyButton = (props: { data: any }) => {
  const data = JSON.stringify(props.data);
  const [showCopied, setShowCopied] = React.useState(false);
  React.useEffect(() => {
    let timer: any;
    if (showCopied) {
      timer = setTimeout(() => {
        setShowCopied(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showCopied]);
  return (
    <Button
      type="button"
      leftIcon={<FiClipboard />}
      color="gray.500"
      bgColor="transparent"
      _hover={{
        color: "gray.600",
      }}
      fontWeight="normal"
      onClick={() => {
        navigator.clipboard.writeText(data);
        setShowCopied(true);
      }}
    >
      {showCopied ? "Copied!" : "Copy JSON"}
    </Button>
  );
};
