import * as React from "react";
import {graphql} from "gatsby";

type LinksSectionProps = {
    links: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.LinkFieldsFragment>>> | undefined
}

export const query = graphql`
    fragment LinkFields on ContentfulSocialLinks {
        name
        url
    }
`;

export default function LinksSection({links}: LinksSectionProps) {
    return (
        <section className="mb-4">
            <h2>Links</h2>
            {links?.map((link, index) => (
                <a key={index} href={link?.url ?? ""}>{link?.name}<br/></a>
            ))}
        </section>
    );
}