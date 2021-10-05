import { Button, ButtonProps } from "@chakra-ui/react";
import { overrideStyles } from "@hyper-next/react-utils";
import Link from "next/link";
import React from "react";
import { SimpleLinkProps } from "../navigation";

export const SimpleLink = (props: SimpleLinkProps) => {
  const { text, href, useColorModeValue, styles } = props;

  const defaultButtonLinkStyles: ButtonProps = {
    color: "gray.500",
    display: "inline-flex",
    alignItems: "center",
    variant: "ghost",
    fontSize: "md",
    _focus: { boxShadow: "none" },
    _hover: { color: useColorModeValue("gray.800", "white") },
    as: "a",
  };

  return (
    <Link href={href} passHref>
      <Button
        {...overrideStyles(defaultButtonLinkStyles, styles?.buttonLinkStyles)}
      >
        {text}
      </Button>
    </Link>
  );
};
