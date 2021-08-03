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
  HTMLChakraProps,
} from '@chakra-ui/react'
import Link from 'next/link'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { overrideStyles, SPACING_X_REACTIVE_VALUES } from '../theme/utils'
import { BaseNavBarProps } from './navBar'




export const BasicNavBar = (props: BaseNavBarProps) => {
  const {
    isAuthed,
    companyIcon,
    loginButton,
    links,
    styles} = props

    const hoverColor = 'gray.400'

    const defaultFlexContainerStyles: HTMLChakraProps<"div"> = {
      w: "100vw",
      py: "1em",
      px: SPACING_X_REACTIVE_VALUES,
      display: "flex",
      flexWrap: "wrap",
      shadow: "sm",
      flexDirection: ["column", "row"],
      alignItems: ["center", "flex-start"],
    }
    
    const defaultBrandingImageStyles: HTMLChakraProps<"div"> = {
      w: "7.5em",
      h: "100%",
    }
    
    const defaultNavBarLinkStyles: HTMLChakraProps<"div"> = {
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
    
    const defaultMenuButtonHoverStyle: HTMLChakraProps<"div"> = {
      _hover: {
        color: hoverColor
      }
    }
    
    const defaultDropDownStyles: HTMLChakraProps<"div"> = {
      fontSize: "1em",
      py: '0',
      mt: '.8em',
      borderRadius: 'none'
    }

  let finalLinks = links
  if (isAuthed) {finalLinks = links.concat([{text: 'App', href: '/app', type: 'link'}])}

  return (
    <Flex {...overrideStyles(defaultFlexContainerStyles, styles?.containerStyle )}>
        <Box>
          <Link href={'/'} passHref>
            <a><Img alt={'Company Branding'} src={companyIcon} {...defaultBrandingImageStyles}/></a>
          </Link>
        </Box>
        <Spacer />
        <Box>
          {finalLinks.map((link) => {
            if (link.type === 'link') {
              return (
                <Link href={link.href} passHref key={link.text}>
                  <Box as='a' {...overrideStyles(defaultNavBarLinkStyles, styles?.linkStyles?.topLevelLinkStyles)}>
                    {link.text}
                  </Box>
                </Link>
              )
            } else {
              return (
                <Menu key={link.title}>
                  <MenuButton {...overrideStyles(defaultMenuButtonHoverStyle, styles?.linkStyles?.dropDownMenuButtonStyles)}>
                    <Box {...overrideStyles(defaultNavBarLinkStyles, styles?.linkStyles?.topLevelLinkStyles)}>
                      {link.title} <ChevronDownIcon ml='.2em'/>
                    </Box>
                  </MenuButton>
                  <MenuList {...overrideStyles(defaultDropDownStyles, styles?.linkStyles?.dropDownLinkStyles)}>
                    {link.links.map((dropDownLink: {text: string, href: string}) => (
                      <MenuItem key={dropDownLink.text}>
                        <Link href={dropDownLink.href} passHref>
                          <Box>
                            {dropDownLink.text}
                          </Box>
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )
            }
          })}
          {loginButton}
        </Box>
    </Flex>
  )
}
