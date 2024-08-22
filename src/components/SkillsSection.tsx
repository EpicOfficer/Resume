import Skill from "./Skill";
import * as React from "react";
import {graphql} from "gatsby";

type SkillsSectionProps = {
    skills: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.SkillFieldsFragment>>>
}

export const query = graphql`
    fragment SkillFields on ContentfulSkill {
        name
        skillLevel
    }
`;

export default function SkillsSection({skills}: SkillsSectionProps) {
    return (
        <section>
            <h2>Skills</h2>
            {skills?.map((skill, index) => (
                <Skill key={index} level={skill?.skillLevel ?? 0}>{skill?.name}</Skill>
            ))}
        </section>
    );
}