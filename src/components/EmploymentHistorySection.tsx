import { formatDate } from "../utils/dateUtils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { graphql } from "gatsby";
import { richTextRenderOptions } from "../utils/richTextRenderOptions";

type EmploymentItem = {
    companyName?: { companyName?: string | null } | null;
    endDate?: string | null;
    jobTitle?: string | null;
    startDate?: string | null;
    description?: { raw?: string | null } | null;
} | null;

type EmploymentHistoryProps = {
    employmentHistory?: EmploymentItem[] | null;
};

export const query = graphql`
    fragment EmploymentHistoryFields on ContentfulEmploymentHistorySection {
        companyName {
            companyName
        }
        endDate
        jobTitle
        startDate
        description {
            raw
        }
    }
`;

export default function EmploymentHistorySection({ employmentHistory }: EmploymentHistoryProps) {
    if (!employmentHistory?.length) return null;

    return (
        <section className="resume-card print-priority">
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
                {employmentHistory.map((job, index) => (
                    <article key={index} className="timeline-item">
                        <header>
                            <h3>{job?.jobTitle}</h3>
                            <p className="timeline-company">{job?.companyName?.companyName}</p>
                            <p className="timeline-date">{formatDate(job?.startDate)} - {job?.endDate ? formatDate(job?.endDate) : "Present"}</p>
                        </header>
                        <div className="timeline-body">
                            {job?.description?.raw && documentToReactComponents(JSON.parse(job.description.raw), richTextRenderOptions)}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
