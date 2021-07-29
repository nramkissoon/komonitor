import React from 'react';
import { Container } from '@chakra-ui/react';

export const Copyright = (props: {name: string}) => (
  <Container centerContent fontWeight='light' fontSize='.8em' pt='0'>
      {'Copyright © '}
      {props.name}
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Container>
)
