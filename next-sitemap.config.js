/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.portfoliogg.com',
    generateRobotsTxt: true,
    //exclude: ['/server-sitemap.xml'], // exclude server-side sitemap
    robotsTxtOptions: {
      /* additionalSitemaps: [
        'https://www.portfoliogg.com/server-sitemap.xml', // Add server-side sitemap
      ], */
    },
}