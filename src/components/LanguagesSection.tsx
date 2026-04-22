import Skill from "./Skill";
import * as React from "react";
import { graphql } from "gatsby";

type LanguageItem = { language?: string | null; skillLevel?: number | null } | null;

type LanguagesSectionProps = {
    languages?: LanguageItem[] | null;
};

export const query = graphql`
    fragment LanguageFields on ContentfulLanguageSection {
        language
        skillLevel
    }
`;

export default function LanguagesSection({ languages }: LanguagesSectionProps) {
    if (!languages?.length) return null;

    return (
        <section className="resume-card print-secondary">
            <h2 className="section-title">Languages</h2>
            <div className="skill-stack">
                {languages.map((lang, index) => (
                    <Skill key={index} level={lang?.skillLevel ?? 0}>{lang?.language}</Skill>
                ))}
            </div>
        </section>
    );
}
