import * as React from "react";

interface SkillProps {
    level: number;
    children: React.ReactNode;
}

export default function Skill({level, children}: SkillProps) {
    return (
        <div className="skill mb-3">
            <p className="mb-0">{children}</p>
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${level / 5 * 100}%` }}
                    aria-valuenow={level / 5 * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}>
                </div>
            </div>
        </div>
    );
}