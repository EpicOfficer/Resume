import React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
    title: string;
    description?: string | null;
    keywords?: (string | null)[];
    author?: string | null;
    lang?: string;
    image?: string | null;
    meta?: { name: string; content: string }[];
}

const SEO: React.FC<SEOProps> = ({
                                     title,
                                     description = "",
                                     keywords = [],
                                     author = "",
                                     lang = "en",
                                     image = "",
                                     meta = []
                                 }) => {
    const validKeywords = keywords?.filter(keyword => keyword !== null).join(", ") || "";

    return (
        <Helmet
            htmlAttributes={{
                lang,
            }}
            title={title}
            meta={[
                {
                    name: `description`,
                    content: description || "",
                },
                {
                    name: `keywords`,
                    content: validKeywords,
                },
                {
                    name: `author`,
                    content: author || "",
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: description || "",
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    property: `og:image`,
                    content: image || "",
                },
                {
                    name: `twitter:card`,
                    content: `summary_large_image`,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: description || "",
                },
                {
                    name: `twitter:image`,
                    content: image || "",
                },
                ...meta,
            ]}
        />
    );
};

export default SEO;