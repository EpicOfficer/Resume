import { formatDate } from "../utils/dateUtils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { graphql } from "gatsby";
import { richTextRenderOptions } from "../utils/richTextRenderOptions";

type EducationItem = {
    startDate?: string | null;
    endDate?: string | null;
    description?: { raw?: string | null } | null;
    institutionName?: string | null;
} | null;

type EducationProps = {
    education?: EducationItem[] | null;
};

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

export default function EducationSection({ education }: EducationProps) {
    if (!education?.length) return null;

    return (
        <section className="resume-card print-secondary">
            <h2 className="section-title">Education & Certifications</h2>
            <div className="stack-list">
                {education.map((edu, index) => (
                    <article key={index} className="stack-list-item">
                        <h3>{edu?.institutionName}</h3>
                        <p className="timeline-date">{formatDate(edu?.startDate)}{edu?.endDate && ` - ${formatDate(edu.endDate)}`}</p>
                        {edu?.description?.raw && documentToReactComponents(JSON.parse(edu.description.raw), richTextRenderOptions)}
                    </article>
                ))}
            </div>
        </section>
    );
}
