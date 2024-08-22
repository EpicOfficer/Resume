import Skill from "./Skill";
import * as React from "react";

type SkillsSectionProps = {
    skills: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.SkillFieldsFragment>>>
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
    return (
        <section>
            <h2>Skills</h2>
            {skills?.map((skill, index) => (
                <Skill key={index} level={skill?.skillLevel ?? 0}>{skill?.name}</Skill>
            ))}
        </section>
    );
}