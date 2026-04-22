import * as React from "react";
import { graphql } from "gatsby";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";

type Details = {
    email?: string | null;
    location?: string | null;
    phone?: string | null;
};

type DetailsProps = {
    details?: Details | null;
};

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

export default function DetailsSection({ details }: DetailsProps) {
    return (
        <section className="resume-card print-priority">
            <h2 className="section-title">Details</h2>
            <ul className="meta-list">
                {details?.location && (
                    <li>
                        <FaLocationDot aria-hidden="true" />
                        <span>{details.location}</span>
                    </li>
                )}
                {details?.phone && (
                    <li>
                        <FaPhone aria-hidden="true" />
                        <a href={`tel:${details.phone}`}>{details.phone}</a>
                    </li>
                )}
                {details?.email && (
                    <li>
                        <FaEnvelope aria-hidden="true" />
                        <a href={`mailto:${details.email}`}>{details.email}</a>
                    </li>
                )}
            </ul>
        </section>
    );
}
