import * as React from "react"
import { ProgressBar } from "react-bootstrap";

interface SkillProps {
    /* The skill level */
    level: number;
    /* The children to be displayed */
    children: React.ReactNode; // this is the type for child components
}

export default function Skill({ level, children }: SkillProps) {
    return (
      <div className="mb-2">
        <p className="mb-0">{children}</p>
        <ProgressBar now={level}></ProgressBar>
      </div>
    );
  }