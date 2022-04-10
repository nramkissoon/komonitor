import { DownloadIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
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
      shadow="sm"
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
