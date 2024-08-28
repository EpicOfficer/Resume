import * as React from "react";
import {graphql} from "gatsby";

type DetailsProps = {
    details: Queries.Maybe<Queries.DetailsFieldsFragment>
}

export const query = graphql`
    fragment DetailsFields on ContentfulPersonalDetails {
        email
        fullName
        jobTitle
        location
        phone
        profileImage {
            gatsbyImageData(
                width: 160,
                height: 160,
                placeholder: BLURRED,
                formats: [AUTO, WEBP, AVIF])
        }
        socialImage: profileImage {
            resize(width: 1200, height: 630, format: PNG) {
                src
            }
        }
        links {
            ...LinkFields
        }
    }
`;

export default function DetailsSection({details}: DetailsProps) {
    return (
        <section className="mb-4">
            <h2>Details</h2>
            <p className="mb-0">{details?.location}</p>
            <p className="mb-0"><a href={`tel:${details?.phone}`}>{details?.phone}</a></p>
            <p className="mb-0"><a href={`mailto:${details?.email}`}>{details?.email}</a></p>
        </section>
    );
}