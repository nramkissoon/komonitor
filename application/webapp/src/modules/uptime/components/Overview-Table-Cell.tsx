import { Text } from "@chakra-ui/react";
import Link from "next/link";

interface DescriptionCellProps {
  monitorId: string;
  name: string;
  url: string;
}

export function DescriptionCell(props: DescriptionCellProps) {
  return (
    <>
      <Link passHref href={`/app/uptime/${props.monitorId}`}>
        {props.name}
      </Link>
      <Text>{props.url}</Text>
    </>
  );
}
