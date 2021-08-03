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
  MenuButtonProps,
  MenuListProps,
} from '@chakra-ui/react'
import Link from 'next/link'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { overrideStyles, SPACING_X_REACTIVE_VALUES } from '../theme/utils'
import { BasicHeaderProps } from './header'


export const BasicHeader = (props: BasicHeaderProps) => {
  const {
    isAuthed,
    companyIcon,
    loginButton,
    links,
    styles} = props

    const hoverColor = 'gray.400'

    const defaultFlexContainerStyles: FlexProps = {
      w: "100vw",
      py: "1em",
      px: SPACING_X_REACTIVE_VALUES,
      display: "flex",
      flexWrap: "wrap",
      shadow: "sm",
      flexDirection: ["column", "row"],
      alignItems: ["center", "flex-start"],
    }
    
    const defaultBrandingImageStyles: ImgProps = {
      w: "7.5em",
      h: "100%",
    }
    
    const defaultHeaderLinkStyles: BoxProps = {
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
    
    const defaultMenuButtonStyle: MenuButtonProps = {
      _hover: {
        color: hoverColor
      }
    }
    
    const defaultDropDownListStyles: MenuListProps = {
      fontSize: "1em",
      py: '0',
      mt: '.8em',
      borderRadius: 'none'
    }

  let finalLinks = links
  if (isAuthed) {finalLinks = links.concat([{text: 'App', href: '/app', type: 'link'}])}

  return (
    <Flex {...overrideStyles(defaultFlexContainerStyles, styles?.flexContainerProps )}>
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
                  <Box as='a' {...overrideStyles(defaultHeaderLinkStyles, styles?.headerLinkProps)}>
                    {link.text}
                  </Box>
                </Link>
              )
            } else {
              return (
                <Menu key={link.title}>
                  <MenuButton {...overrideStyles(defaultMenuButtonStyle, styles?.dropDownMenuButtonProps)}>
                    <Box {...overrideStyles(defaultHeaderLinkStyles, styles?.headerLinkProps)}>
                      {link.title} <ChevronDownIcon ml='.2em'/>
                    </Box>
                  </MenuButton>
                  <MenuList {...overrideStyles(defaultDropDownListStyles, styles?.dropDownMenuListProps)}>
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
