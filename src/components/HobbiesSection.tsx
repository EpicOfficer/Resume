import * as React from "react";

type HobbiesSectionProps = {
    hobbies: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.Scalars['String']>>>
}

export default function HobbiesSection({hobbies}: HobbiesSectionProps) {
    return (
        <section className="mb-4">
            <h2>Hobbies</h2>
            {hobbies?.map((hobby, index) => (
                <p key={index} className="mb-0">{hobby}</p>
            ))}
        </section>
    );
}