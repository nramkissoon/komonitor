import React from "react";
import Link from "next/link";
import { Button, ButtonProps } from "@chakra-ui/react";
import { overrideStyles } from "../theme/utils";

interface LoginButtonProps extends ButtonProps {
  isAuthed: boolean;
  authRoute: string;
  logout: Function;
}

export const LoginButton = (props: LoginButtonProps) => {
  const { isAuthed, authRoute, logout, ...rest } = props;

  const defaultLoginButtonStyles: ButtonProps = {
    size: "md",
    variant: "outline",
    shadow: "md",
    fontWeight: "bold",
  };

  const button = (
    <Button
      onClick={isAuthed ? () => logout() : () => {}}
      {...overrideStyles(defaultLoginButtonStyles, rest)}
    >
      {isAuthed ? "Log out" : "Log in"}
    </Button>
  );

  return isAuthed ? (
    button
  ) : (
    <Link href={authRoute} passHref>
      {button}
    </Link>
  );
};
