import React from 'react';
import Link from "next/link";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  link: {
    margin: theme.spacing(1, 1.5),
  },
}))

const LoginButton = (isAuthed: boolean) => {
  const cssClasses = useStyles();

  return (
    <Link href={ isAuthed ? "/logout" : "/login" } passHref>
      <Button component="a" color='primary' variant='outlined' className={cssClasses.link}>
        { isAuthed ? "Logout" : "Login" }
      </Button>
    </Link>
  )
}

export default LoginButton;