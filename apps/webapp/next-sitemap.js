/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://komonitor.com',
    generateRobotsTxt: true, // (optional)
    exclude: ['/app*', '/auth*', '/demo*', '/teams*', '/integrations/discord/callback', '/integrations/slack/callback', '/teams/new-member']
  }