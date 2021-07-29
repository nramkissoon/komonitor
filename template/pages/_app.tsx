import React from 'react';
import type { AppProps } from 'next/app'

/**
 * chakra UI imports
 * To customize the default theme provided, see https://chakra-ui.com/docs/theming/customize-theme.
 */
import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/roboto" // see https://chakra-ui.com/guides/using-fonts for configuring fonts.
import defaultTheme from '../src/prebuiltUI/theme/defaultTheme';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
