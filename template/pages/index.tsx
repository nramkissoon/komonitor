import * as React from 'react'
import { LoginButton } from '../src/template/prebuiltUI/buttons/loginButton';
import { BasicNavBar } from '../src/template/prebuiltUI/navBars/BasicNavBar'
import { SimpleSocialFooter } from '../src/template/prebuiltUI/footers/simpleSocialFooter';
import { SimpleCenteredFooter } from '../src/template/prebuiltUI/footers/simpleCenteredFooter';
import FacebookIcon from './../public/svg/social/facebook.svg'
import InstaIcon from './../public/svg/social/instagram.svg'
import TwitterIcon from './../public/svg/social/twitter.svg'
import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react';

const Home = () => {
  const isAuthed = false;
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <BasicNavBar
        isAuthed={isAuthed}
        companyIcon='/svg/brandingPlaceholder.svg'
        links={[
          { text: 'Pricing', href: '/pricing', type: 'link' },
          { text: 'About', href: '/about', type: 'link' },
          {
            type: 'dropdown', title: 'Resources', links:
              [{ text: 'Blog', href: '#', type: 'link' }, { text: 'Docs', href: '#', type: 'link' }]
          },
        ]}
        loginButton={<LoginButton isAuthed={isAuthed} logout={() => { }} size='md'/>}
      />
      <SimpleSocialFooter
        companyName={'company'}
        privacyPolicyLink={{ text: 'Privacy', href: '#' }}
        termsOfServiceLink={{ text: 'Terms', href: '#' }}
        socialLinks={[
          { text: 'Facebook', icon: <FacebookIcon />, href: '#' },
          { text: 'Instagram', icon: <InstaIcon />, href: '#' },
          {text: 'Twitter', icon: <TwitterIcon />, href:'#'}
        ]}
      />
      <SimpleCenteredFooter
        copyright={'copyright'}
        pageLinks={[
          { text: 'Pricing', href: '/pricing'},
          { text: 'About', href: '/about' },
          { text: 'Blog', href: '#' },
          { text: 'Jobs', href: '#' },
          { text: 'Press', href: '#' },
        ]}
        socialLinks={[
          { text: 'Facebook', icon: <FacebookIcon />, href: '/a' },
          { text: 'Instagram', icon: <InstaIcon />, href: '/b' },
          {text: 'Twitter', icon: <TwitterIcon />, href:'/c'}
        ]}
      />
    </>
  )
}

export default Home
