import * as React from 'react'
import { Copyright } from '../src/prebuiltUI/general/copyright'
import { LoginButton } from '../src/prebuiltUI/general/loginButton';
import { BasicNavBar } from '../src/prebuiltUI/navBars/BasicNavBar'

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
              [{ text: 'Blog', href: '#', type: 'TextLink' }, { text: 'Docs', href: '#', type: 'TextLink' }]
          },
        ]}
        loginButton={LoginButton({ isAuthed: isAuthed, logout: () => { } })}
      />
      <Copyright name='Company'/>
    </>
  )
}

export default Home
