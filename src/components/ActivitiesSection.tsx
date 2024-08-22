import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import * as React from "react";
import {graphql} from "gatsby";

type ActivitiesProps = {
    activities: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.ActivitiesFieldsFragment>>>
}

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

export default function ActivitiesSection({activities}: ActivitiesProps) {
    return (
        <section>
            <h2>Extra-curricular Activities</h2>
            {activities?.map((activity, index) => (
                <div key={index}>
                    <h3>{activity?.title}, {activity?.location}</h3>
                    <h4>{activity?.year}</h4>
                    {activity?.fullDescription?.raw && documentToReactComponents(JSON.parse(activity.fullDescription.raw))}
                </div>
            ))}
        </section>
    );
}