import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { graphql } from "gatsby";
import { richTextRenderOptions } from "../utils/richTextRenderOptions";

type ActivityItem = {
    title?: string | null;
    year?: string | null;
    location?: string | null;
    fullDescription?: { raw?: string | null } | null;
} | null;

type ActivitiesProps = {
    activities?: ActivityItem[] | null;
};

export const query = graphql`
    fragment ActivitiesFields on ContentfulExtraCurricularSection {
        title
        year
        location
        fullDescription {
            raw
        }
    }
`;

export default function ActivitiesSection({ activities }: ActivitiesProps) {
    if (!activities?.length) return null;

    return (
        <section className="resume-card print-secondary">
            <h2 className="section-title">Projects & Initiatives</h2>
            <div className="project-grid">
                {activities.map((activity, index) => (
                    <article key={index} className="project-card">
                        <h3>{activity?.title}</h3>
                        <p className="project-meta">{activity?.location}{activity?.year && ` · ${activity.year}`}</p>
                        {activity?.fullDescription?.raw && documentToReactComponents(JSON.parse(activity.fullDescription.raw), richTextRenderOptions)}
                    </article>
                ))}
            </div>
        </section>
    );
}
