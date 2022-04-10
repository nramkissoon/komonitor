import { DownloadIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import React from "react";
import { FiClipboard } from "react-icons/fi";
interface JSONDownloadButtonProps {
  data: any;
  filename: string;
}

export function JSONDownloadButton(props: JSONDownloadButtonProps) {
  const { data, filename } = props;
  return (
    <Button
      as="a"
      type="button"
      href={`data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
      )}`}
      leftIcon={<DownloadIcon />}
      download={filename}
      color="gray.500"
      bgColor="transparent"
      _hover={{
        color: "gray.600",
      }}
      fontWeight="normal"
    >
      Export Table as JSON
    </Button>
  );
}

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
