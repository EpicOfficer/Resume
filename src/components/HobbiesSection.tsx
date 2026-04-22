import * as React from "react";

type HobbiesSectionProps = {
    hobbies?: (string | null)[] | null;
};

export default function HobbiesSection({ hobbies }: HobbiesSectionProps) {
    if (!hobbies?.length) return null;

    return (
        <section className="resume-card print-secondary">
            <h2 className="section-title">Interests</h2>
            <ul className="pill-list">
                {hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                ))}
            </ul>
        </section>
    );
}
