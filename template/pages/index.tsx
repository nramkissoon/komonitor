import * as React from 'react'
import { LoginButton } from '../src/prebuiltUI/general/loginButton';
import { BasicNavBar } from '../src/prebuiltUI/navBars/BasicNavBar'
import { SimpleSocialFooter } from '../src/prebuiltUI/footers/simpleSocialFooter';
import FacebookIcon from './../public/svg/social/facebook.svg'
import InstaIcon from './../public/svg/social/instagram.svg'
import TwitterIcon from './../public/svg/social/twitter.svg'

const Home = () => {
  const isAuthed = false;

  return (
    <>
      <BasicNavBar
        isAuthed={isAuthed}
        brandingImageSrc='/svg/brandingPlaceholder.svg'
        links={[
          { text: 'Pricing', href: '/pricing', type: 'link' },
          { text: 'About', href: '/about', type: 'link' },
          {
            type: 'dropdown', title: 'Resources', links:
              [{ text: 'Blog', href: '#', type: 'link' }, { text: 'Docs', href: '#', type: 'link' }]
          },
        ]}
        loginButton={LoginButton({ isAuthed: isAuthed, logout: () => { } })}
      />
      <SimpleSocialFooter
        companyName={'company'}
        privacyPolicyLink={{ text: 'Privacy', href: '#' }}
        termsOfServiceLink={{ text: 'Terms', href: '#' }}
        socialLinks={[
          { text: 'Facebook', icon: <FacebookIcon />, href: '#' },
          { text: 'Instagram', icon: <InstaIcon />, href: '#' },
          {text: 'Twitter', icon: <TwitterIcon />, href:'#'}
        ] }
      />
    </>
  )
}

export default Home
