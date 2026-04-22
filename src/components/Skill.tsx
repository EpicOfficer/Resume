import * as React from "react";

interface SkillProps {
    level: number;
    children: React.ReactNode;
}

function clampSkillLevel(level: number) {
    return Math.max(0, Math.min(5, level || 0));
}

export default function Skill({ level, children }: SkillProps) {
    const skillLevel = clampSkillLevel(level);
    const percentage = Math.round((skillLevel / 5) * 100);

    return (
        <div className="skill-item">
            <div className="skill-item__meta">
                <span className="skill-item__name">{children}</span>
                <span className="skill-item__level" aria-label={`Skill strength ${skillLevel} out of 5`}>
                    {skillLevel}/5
                </span>
            </div>
            <div className="skill-item__track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className="skill-item__fill" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
