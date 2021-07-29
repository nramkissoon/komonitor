import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from "next/link";
import Button from "@material-ui/core/Button";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import LoginButton from './loginButton';

const styles = ({spacing, palette}: Theme) => createStyles({
  appBar: {
    borderBottom: `1px solid ${palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: spacing(1, 1.5),
  }
})

interface TopNavBarProps extends WithStyles<typeof styles> {
  isAuthed: boolean
}

const TopNavBar = withStyles(styles)((props: TopNavBarProps) => {
  const {classes, isAuthed} = props;

  return (
    <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            App Name
        </Typography>
        <nav>
          <Link href="#" passHref>
            <Button component="a" className={classes.link}>
              Link1
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button component="a" className={classes.link}>
              Link2
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button component="a" className={classes.link}>
              Link3
            </Button>
          </Link>
        </nav>
        {<LoginButton isAuthed={isAuthed}/> }
      </Toolbar>
    </AppBar>
  )
})

export default TopNavBar;