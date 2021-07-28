import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from "next/link";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import LoginButton from './loginButton';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}))

const TopNavBar = (isAuthed: boolean) => {
  const cssClasses = useStyles();

  return (
    <AppBar position="static" color="default" elevation={0} className={cssClasses.appBar}>
      <Toolbar className={cssClasses.toolbar}>
        <Typography variant="h6" color="inherit" noWrap className={cssClasses.toolbarTitle}>
            App Name
        </Typography>
        <nav>
          <Link href="#" passHref>
            <Button component="a" className={cssClasses.link}>
              Link1
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button component="a" className={cssClasses.link}>
              Link2
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button component="a" className={cssClasses.link}>
              Link3
            </Button>
          </Link>
        </nav>
        { LoginButton(isAuthed) }
      </Toolbar>
    </AppBar>
  )
}

export default TopNavBar;