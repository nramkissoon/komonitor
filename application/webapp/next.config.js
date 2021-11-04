/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = require('@next/mdx')()

const withImages = require('next-images')
module.exports = (withMDX(withImages(
  withBundleAnalyzer(
    {reactStrictMode: true,
       pageExtensions: ['ts', 'tsx',],
        async redirects() {return [{source: '/docs', destination: '/docs/getting-started/overview', permanent: true}]}}))))