/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withTM = require("next-transpile-modules")(["react-timezone-select"])

const withImages = require('next-images')
module.exports = withTM(withImages(
  withBundleAnalyzer(
    {
      reactStrictMode: true,
      pageExtensions: ['ts', 'tsx',],
      async redirects() {return [{source: '/docs', destination: '/docs/getting-started/introduction', permanent: true}]}
    }
    )
  )
  )