import Skill from "./Skill";
import * as React from "react";
import { graphql } from "gatsby";

type SkillItem = { name?: string | null; skillLevel?: number | null } | null;

type SkillsSectionProps = {
    skills?: SkillItem[] | null;
};

export const query = graphql`
    fragment SkillFields on ContentfulSkill {
        name
        skillLevel
    }
`;

export default function SkillsSection({ skills }: SkillsSectionProps) {
    if (!skills?.length) return null;

    const sortedSkills = [...skills].sort((a, b) => (b?.skillLevel ?? 0) - (a?.skillLevel ?? 0));

    return (
        <section className="resume-card print-priority">
            <h2 className="section-title">Core Skills</h2>
            <div className="skill-stack">
                {sortedSkills.map((skill, index) => (
                    <Skill key={index} level={skill?.skillLevel ?? 0}>{skill?.name}</Skill>
                ))}
            </div>
        </section>
    );
}
