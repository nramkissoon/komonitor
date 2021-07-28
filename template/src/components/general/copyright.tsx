import React from 'react';
import Typography from '@material-ui/core/Typography';

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Your Website
      {new Date().getFullYear()}
      {'.'}
    </Typography>
)

export default Copyright