import React from 'react';
import Link from "next/link";
import { Button, ComponentDefaultProps } from '@chakra-ui/react'

interface LoginButtonProps extends ComponentDefaultProps {
  isAuthed: boolean
  logout: Function
}

export const LoginButton = (props: LoginButtonProps) => {
  const {isAuthed, logout, ...rest} = props;

  const button = (
    <Button
      size='md' variant='outline' shadow='md' fontWeight='bold'
      onClick={isAuthed ? () => logout() : () => { }}
      {...rest}
    >
      {isAuthed ? 'Log out' : 'Log in'}
    </Button>
  )

  return isAuthed ? button : <Link href='/auth' passHref>{ button }</Link>
}
