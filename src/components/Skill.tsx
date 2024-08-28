import * as React from "react";

interface SkillProps {
    level: number;
    children: React.ReactNode;
}

export default function Skill({level, children}: SkillProps) {
    // Generate a unique id using a random string with slice instead of substr
    const uniqueId = React.useMemo(() => `label-${Math.random().toString(36).slice(2, 11)}`, []);
    
    return (
        <div className="skill mb-3">
            <p id={uniqueId} className="mb-0">{children}</p>
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${level / 5 * 100}%` }}
                    aria-labelledby={uniqueId}
                    aria-valuenow={level / 5 * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}>
                </div>
            </div>
        </div>
    );
}