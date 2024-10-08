import Skill from "./Skill";
import * as React from "react";
import {graphql} from "gatsby";

type LanguagesSectionProps = {
    languages: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.LanguageFieldsFragment>>>
}

export const query = graphql`
    fragment LanguageFields on ContentfulLanguageSection {
        language
        skillLevel
    }
`;

export default function LanguagesSection({languages}: LanguagesSectionProps) {
    return (
        <section className="mb-4">
            <h2>Languages</h2>
            {languages?.map((lang, index) => (
                <Skill key={index} level={lang?.skillLevel ?? 0}>{lang?.language}</Skill>
            ))}
        </section>
    );
}