/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withImages = require('next-images')
module.exports = (withImages(
  withBundleAnalyzer(
    {
      reactStrictMode: true,
      pageExtensions: ['ts', 'tsx',],
      async redirects() {return [{source: '/docs', destination: '/docs/getting-started/introduction', permanent: true}]}
    }
    )
  )
  )