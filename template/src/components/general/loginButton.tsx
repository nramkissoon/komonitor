import React from 'react';
import Link from "next/link";
import Button from "@material-ui/core/Button";
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';

const styles = ({spacing}: Theme) => createStyles({
  link: {
    margin: spacing(1, 1.5)
  },
})

interface LoginButtonProps extends WithStyles<typeof styles> {
  isAuthed: boolean
}

const LoginButton = withStyles(styles)((props: LoginButtonProps) => {
  const {classes, isAuthed} = props;

  return (
    <Link href={ isAuthed ? "/logout" : "/login" } passHref>
      <Button component="a" color='primary' variant='outlined' className={classes.link}>
        { isAuthed ? "Logout" : "Login" }
      </Button>
    </Link>
  )
})

export default LoginButton;