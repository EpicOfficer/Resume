import type {GatsbyConfig} from "gatsby";

require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}`, override: true });

const config: GatsbyConfig = {
    siteMetadata: {
        title: "Developer Portfolio",
        description: "Full stack engineer portfolio covering web, backend, and infrastructure delivery.",
        siteUrl: process.env.SITE_URL ?? "https://example.com"
    },
    // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
    // If you use VSCode you can also use the GraphQL plugin
    // Learn more at: https://gatsby.dev/graphql-typegen
    graphqlTypegen: true,
    plugins: ["gatsby-plugin-sass", "gatsby-plugin-image", "gatsby-plugin-sharp", "gatsby-transformer-sharp", "gatsby-plugin-preact", {
        resolve: 'gatsby-plugin-manifest',
        options: {
            "icon": "src/images/profile.png"
        }
    }, {
        resolve: 'gatsby-source-filesystem',
        options: {
            "name": "images",
            "path": "./src/images/"
        },
        __key: "images"
    }, {
        resolve: 'gatsby-source-filesystem',
        options: {
            "name": "pages",
            "path": "./src/pages/"
        },
        __key: "pages"
    }, {
        resolve: 'gatsby-source-contentful',
        options: {
            spaceId: process.env.CONTENTFUL_SPACE_ID!,
            accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
        },
    }, {
        resolve: `gatsby-plugin-google-fonts`,
        options: {
            fonts: [
                `inter\:400,500,600,700`,
                `sora\:500,600,700`
            ],
            display: 'swap' // ensures the font displays correctly while loading
        }
    }]
};

export default config;
