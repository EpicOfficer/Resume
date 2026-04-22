import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { graphql } from "gatsby";
import { richTextRenderOptions } from "../utils/richTextRenderOptions";

type SectionItem = {
    title?: string | null;
    content?: { raw?: string | null } | null;
} | null;

type SectionsProps = {
    sections?: SectionItem[] | null;
};

export const query = graphql`
    fragment SectionFields on ContentfulMarkdownSection {
        title
        content {
            raw
        }
    }
`;

export default function Sections({ sections }: SectionsProps) {
    if (!sections?.length) return null;

    return (
        <>
            {sections.map((section, index) => (
                <section key={index} className="resume-card print-priority">
                    <h2 className="section-title">{section?.title}</h2>
                    {section?.content?.raw && documentToReactComponents(JSON.parse(section.content.raw), richTextRenderOptions)}
                </section>
            ))}
        </>
    );
}
