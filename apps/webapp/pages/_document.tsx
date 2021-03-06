import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@komonitor" />
          <meta name="twitter:title" content="Komonitor" />
          <meta
            name="twitter:description"
            content="Simple website monitoring and alerting for everybody."
          />
          <meta
            name="twitter:image"
            content="https://komonitor.com/twitter-large-summary.jpg"
          />
          <meta name="twitter:image:alt" content="Komonitor banner" />
          <meta name="slack-app-id" content="A02Q5CBHP0W"></meta>
          <script
            defer
            data-domain="komonitor.com"
            src="https://plausible.io/js/plausible.exclusions.js"
            data-exclude="/app/**"
          ></script>
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
