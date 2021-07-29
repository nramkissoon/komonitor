import * as React from 'react'
import {
  Flex,
  Box,
  Spacer,
  Img,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  ComponentDefaultProps,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import Link from 'next/link'
import { LoginButton } from './loginButton'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { hoverColor } from '../theme/components/topNavBar'


interface TextLinkProps {
  type: "TextLink",
  text: string,
  href: string
}

interface DropDownLinkProps {
  type: "DropDownLink",
  title: string,
  links: TextLinkProps[]
}

interface TopNavBarProps extends ComponentDefaultProps {
  isAuthed: boolean,
  logout: Function,
  brandingImgSrc: string,
  links: (TextLinkProps | DropDownLinkProps)[]
}

export const TopNavBar = (props: TopNavBarProps) => {
  const {
    size,
    variant,
    children,
    brandingImgSrc,
    isAuthed,
    logout,
    links,
    ...rest } = props
  
  const styles = useMultiStyleConfig("TopNavBar", { variant })

  let finalLinks = links
  if (isAuthed) {finalLinks = links.concat([{text: 'App', href: '/app', type: 'TextLink'}])}

  return (
    <Flex __css={styles.topNavBar} {...rest}>
      <StylesProvider value={styles}>
        <Branding brandingImgSrc={brandingImgSrc} />
        <Spacer />
        <Box>
          {finalLinks.map((link) => {
            if (link.type === 'TextLink') {
              return (
                <TextLink {...link} key={link.text}/>
              )
            } else {
              return <DropDownLink {...link} key={link.title}/>
            }
          })}
          <LoginButton isAuthed={isAuthed} logout={logout} ml='1.5vw'/>
        </Box>
      </StylesProvider>
    </Flex>
  )
}

const Branding = (props: { brandingImgSrc: string }) => {
  const {brandingImgSrc} = props
  const styles = useStyles()
  return (
    <Box>
      <Link href={'/'} passHref>
        <a><Img alt={'Company Branding'} src={brandingImgSrc} __css={ styles.brandingImg }/></a>
      </Link>
    </Box>
  )
}

const TextLink = (props: TextLinkProps) => {
  const { text, href } = props
  const styles = useStyles()
  return (
    <Link href={href} passHref>
      <Box as='a' __css={styles.links}>
        {text}
      </Box>
    </Link>
  )
}

const DropDownLink = (props: DropDownLinkProps) => {
  const { title, links } = props
  const styles = useStyles()
  return (
    <Menu>
      <MenuButton _hover={{ color: hoverColor }}>
        <Box __css={styles.links}>
          {title} <ChevronDownIcon ml='.2vw'/>
        </Box>
      </MenuButton>
      <MenuList>
        {links.map((link) => (
          <MenuItem key={link.text}>
            <Link href={link.href} passHref>
              <Box __css={styles.dropDownLinks}>
                {link.text}
              </Box>
            </Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
