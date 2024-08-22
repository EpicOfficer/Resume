import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import * as React from "react";
import {graphql} from "gatsby";

type SectionsProps = {
    sections: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.SectionFieldsFragment>>>
}

export const query = graphql`
    fragment SectionFields on ContentfulMarkdownSection {
        title
        content {
            raw
        }
    }
`;

export default function Sections({sections}: SectionsProps) {
    return sections?.map((section, index) => (
        <section key={index}>
            <h2>{section?.title}</h2>
            {section?.content?.raw && documentToReactComponents(JSON.parse(section.content.raw))}
        </section>
    ));
};