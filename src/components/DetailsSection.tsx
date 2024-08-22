import * as React from "react";

type DetailsProps = {
    details: Queries.Maybe<Queries.DetailsFieldsFragment>
}

export default function DetailsSection({ details }: DetailsProps) {
    return (
        <section className="mb-4">
            <h2>Details</h2>
            <p className="mb-0">{details?.location}</p>
            <p className="mb-0"><a href={`tel:${details?.phone}`}>{details?.phone}</a></p>
            <p className="mb-0"><a href={`mailto:${details?.email}`}>{details?.email}</a></p>
        </section>
    );
}