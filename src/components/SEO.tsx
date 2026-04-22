import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";

interface SEOProps {
    title: string;
    description?: string | null;
    keywords?: (string | null)[];
    author?: string | null;
    lang?: string;
    image?: string | null;
    pathname?: string;
    meta?: { name?: string; property?: string; content: string }[];
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "",
    keywords = [],
    author = "",
    lang = "en",
    image = "",
    pathname = "/",
    meta = []
}) => {
    const { site } = useStaticQuery(graphql`
        query SeoMeta {
            site {
                siteMetadata {
                    siteUrl
                    title
                }
            }
        }
    `);

    const siteUrl = site?.siteMetadata?.siteUrl ?? "https://example.com";
    const defaultTitle = site?.siteMetadata?.title ?? "Developer Portfolio";
    const canonicalUrl = new URL(pathname, siteUrl).toString();
    const validKeywords = keywords?.filter(Boolean).join(", ") || "";
    const imageUrl = image ? new URL(image, siteUrl).toString() : undefined;

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author || defaultTitle,
        jobTitle: "Full Stack Developer",
        url: canonicalUrl,
        image: imageUrl,
        sameAs: [],
        knowsAbout: validKeywords ? validKeywords.split(", ").map((k) => k.trim()) : undefined
    };

    return (
        <Helmet
            htmlAttributes={{ lang }}
            title={title}
            titleTemplate={`%s | ${defaultTitle}`}
            link={[{ rel: "canonical", href: canonicalUrl }]}
            meta={[
                { name: "description", content: description || "" },
                { name: "keywords", content: validKeywords },
                { name: "author", content: author || "" },
                { property: "og:title", content: title },
                { property: "og:description", content: description || "" },
                { property: "og:type", content: "website" },
                { property: "og:url", content: canonicalUrl },
                ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
                { name: "twitter:card", content: "summary_large_image" },
                { name: "twitter:title", content: title },
                { name: "twitter:description", content: description || "" },
                ...(imageUrl ? [{ name: "twitter:image", content: imageUrl }] : []),
                ...meta,
            ]}
        >
            <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
        </Helmet>
    );
};

export default SEO;
