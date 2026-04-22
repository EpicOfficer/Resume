import * as React from "react";
import { graphql } from "gatsby";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

type LinkItem = { name?: string | null; url?: string | null } | null;

type LinksSectionProps = {
    links?: LinkItem[] | null;
};

export const query = graphql`
    fragment LinkFields on ContentfulSocialLinks {
        name
        url
    }
`;

export default function LinksSection({ links }: LinksSectionProps) {
    if (!links?.length) return null;

    return (
        <section className="resume-card print-priority">
            <h2 className="section-title">Links</h2>
            <ul className="link-list">
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link?.url ?? "#"} target="_blank" rel="noopener noreferrer">
                            <span>{link?.name}</span>
                            <FaArrowUpRightFromSquare aria-hidden="true" />
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
