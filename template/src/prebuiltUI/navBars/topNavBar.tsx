import * as React from 'react'
import {
  Flex,
  Box,
  Spacer,
  Img,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FlexProps,
  ImgProps,
  BoxProps,
  HTMLChakraProps,
} from '@chakra-ui/react'
import Link from 'next/link'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { overrideStyles, SPACING_X_REACTIVE_VALUES } from '../theme/utils'
import { DropDownProps, NavBarLinkProps, BaseNavBarProps } from './navBar'

const hoverColor = 'gray.600'

const flexContainerStyles: FlexProps = {
  w: "100vw",
  py: "1em",
  px: SPACING_X_REACTIVE_VALUES,
  display: "flex",
  flexWrap: "wrap",
  shadow: "sm",
  flexDirection: ["column", "row"],
  alignItems: ["center", "flex-start"],
}

const brandingImageStyles: ImgProps = {
  w: "7.5em",
  h: "100%",
}

const navBarlinkStyles: BoxProps = {
  verticalAlign: "middle",
  display: "inline-block",
  marginRight: "1.5vw",
  marginLeft: "1.5vw",
  fontSize: "1em",
  fontWeight: "bold",
  _hover: {
    color: hoverColor,
  },
}

const menuButtonHoverStyle: HTMLChakraProps<"div"> = {
  _hover: {
    color: hoverColor
  }
}

const dropDownStyles: BoxProps = {
  fontSize: "1em",
}


export const TopNavBar = (props: BaseNavBarProps) => {
  const {
    isAuthed,
    brandingImageSrc,
    loginButton,
    links,
    navBarStyles} = props


  let finalLinks = links
  if (isAuthed) {finalLinks = links.concat([{text: 'App', href: '/app', type: 'link'}])}

  return (
    <Flex {...overrideStyles(flexContainerStyles, navBarStyles?.containerStyle )}>
        <Branding brandingImgSrc={brandingImageSrc}/>
        <Spacer />
        <Box>
          {finalLinks.map((link) => {
            if (link.type === 'link') {
              return (
                <TextLink {...link} key={link.text} styles={navBarStyles?.linkStyles?.topLevelLinkStyles}/>
              )
            } else {
              return <DropDownLink {...link} key={link.title} linkStyles={navBarStyles?.linkStyles} />
            }
          })}
          {loginButton}
        </Box>
    </Flex>
  )
}

const Branding = (props: { brandingImgSrc: string }) => {
  const {brandingImgSrc} = props
  return (
    <Box>
      <Link href={'/'} passHref>
        <a><Img alt={'Company Branding'} src={brandingImgSrc} {...brandingImageStyles}/></a>
      </Link>
    </Box>
  )
}

const TextLink = (props: NavBarLinkProps) => {
  const { text, href, styles } = props
  return (
    <Link href={href} passHref>
      <Box as='a' {...overrideStyles(navBarlinkStyles, styles)}>
        {text}
      </Box>
    </Link>
  )
}

const DropDownLink = (props: DropDownProps) => {
  const { title, links, linkStyles } = props
  return (
    <Menu>
      <MenuButton {...overrideStyles(menuButtonHoverStyle, linkStyles?.menuButtonStyles)}>
        <Box {...overrideStyles(navBarlinkStyles, linkStyles?.topLevelLinkStyles)}>
          {title} <ChevronDownIcon ml='.2em'/>
        </Box>
      </MenuButton>
      <MenuList>
        {links.map((link) => (
          <MenuItem key={link.text}>
            <Link href={link.href} passHref>
              <Box {...overrideStyles(dropDownStyles, linkStyles?.dropDownLinkStyles)}>
                {link.text}
              </Box>
            </Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
