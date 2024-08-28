import React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
    title: string;
    description?: string | null;
    keywords?: (string | null)[];
    author?: string | null;
    lang?: string;
    meta?: { name: string; content: string }[];
    ogDescription?: string | null;
}

const SEO: React.FC<SEOProps> = ({
                                     title,
                                     description = "",
                                     keywords = [],
                                     author = "",
                                     lang = "en",
                                     meta = [],
                                     ogDescription
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
                    content: ogDescription || description || "",
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: description || "",
                },
                ...meta,
            ]}
        />
    );
};

export default SEO;