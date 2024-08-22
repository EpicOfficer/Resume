import * as React from "react";

type LinksSectionProps = {
    links: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.LinkFieldsFragment>>> | undefined
}

export default function LinksSection({ links }: LinksSectionProps) {
    return (
        <section className="mb-4">
            <h2>Links</h2>
            {links?.map((link, index) => (
                <a key={index} href={link?.url ?? ""}>{link?.name}<br/></a>
            ))}
        </section>
    );
}