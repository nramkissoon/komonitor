import React from "react";
import Link from "next/link";
import { Button, ButtonProps } from "@chakra-ui/react";
import { overrideStyles } from "@hyper-next/react-utils";

export interface LoginButtonProps extends ButtonProps {
  isAuthed: boolean;
  authRoute: string;
  logout: Function;
  isAuthedButtonText: string;
  notAuthedButtonText: string;
}

export const LoginButton = (props: LoginButtonProps) => {
  const {
    isAuthed,
    authRoute,
    logout,
    isAuthedButtonText,
    notAuthedButtonText,
    ...rest
  } = props;

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
      {isAuthed ? isAuthedButtonText : notAuthedButtonText}
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
