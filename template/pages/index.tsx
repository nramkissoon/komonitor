import * as React from 'react'
import { Copyright } from '../src/prebuiltUI/general/copyright'
import { TopNavBar } from '../src/prebuiltUI/general/topNavBar'

const topNavBarLinks = [
  { text: 'Pricing', href: '/pricing', type: 'TextLink' },
  { text: 'About', href: '/about', type: 'TextLink' },
  {
    type: 'DropDownLink', title: 'Resources', links:
      [{ text: 'Blog', href: '#', type: 'TextLink' }, { text: 'Docs', href: '#', type: 'TextLink' }]
  },
]

const Home = () => {
  const isAuthed = false;

  return (
    <>
      <TopNavBar
        isAuthed={isAuthed}
        logout={() => { }}
        brandingImgSrc='/svg/brandingPlaceholder.svg'
        links={[
          { text: 'Pricing', href: '/pricing', type: 'TextLink' },
          { text: 'About', href: '/about', type: 'TextLink' },
          {
            type: 'DropDownLink', title: 'Resources', links:
              [{ text: 'Blog', href: '#', type: 'TextLink' }, { text: 'Docs', href: '#', type: 'TextLink' }]
          },
        ]}
      />
      <Copyright name='Company'/>
    </>
  )
}

export default Home
