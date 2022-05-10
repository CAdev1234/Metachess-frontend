require("dotenv").config({
  path: `.env.${process.env.GATSBY_ENV}`,
});

module.exports = {
  siteMetadata: {
    name: `Hello Chess World!`,
    tagline: `Chess 💪`,
    siteUrl: `https://game.metachess.network/`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-use-query-params`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "fonts",
        path: `${__dirname}/static/fonts/`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-LBDDJ6NTKY", // Google Analytics / GA
          // optional
          // 'OPTIONAL----AW-CONVERSION_ID', // Google Ads / Adwords / AW
          // 'OPTIONAL----DC-FLOODIGHT_ID', // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
        ],
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
        },
      },
    },
  ],
};
