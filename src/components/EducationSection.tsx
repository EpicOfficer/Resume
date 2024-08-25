import {formatDate} from "../utils/dateUtils";
import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import * as React from "react";
import {graphql} from "gatsby";
import {richTextRenderOptions} from "../utils/richTextRenderOptions";

type EducationProps = {
    education: Queries.Maybe<ReadonlyArray<Queries.Maybe<Queries.EducationFieldsFragment>>>
}

export const query = graphql`
    fragment EducationFields on ContentfulEducationSection {
        startDate
        endDate
        description {
            raw
        }
        institutionName
    }
`;

export default function EducationSection({education}: EducationProps) {
    return (
        <section>
            <h2>Education</h2>
            {education?.map((edu, index) => (
                <div key={index}>
                    <h3>{edu?.institutionName}</h3>
                    <h4>{formatDate(edu?.startDate)}{edu?.endDate && ` - ${formatDate(edu.endDate)}`}</h4>
                    {edu?.description?.raw && documentToReactComponents(JSON.parse(edu.description.raw), richTextRenderOptions)}
                </div>
            ))}
        </section>
    );
}