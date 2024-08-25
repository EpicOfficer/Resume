import { formatDate } from "../utils/dateUtils";
import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { graphql } from "gatsby";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import {richTextRenderOptions} from "../utils/richTextRenderOptions";

type EmploymentHistoryProps = {
    employmentHistory: Queries.Maybe<
        ReadonlyArray<Queries.Maybe<Queries.EmploymentHistoryFieldsFragment>>
    >;
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
    return (
        <section>
            <h2>Employment History</h2>
            {employmentHistory?.map((job, index) => (
                <div key={index}>
                    <h3>{job?.jobTitle}, {job?.companyName?.companyName}</h3>
                    <h4>{formatDate(job?.startDate)} - {formatDate(job?.endDate)}</h4>
                    {job?.description?.raw && documentToReactComponents(JSON.parse(job.description.raw), richTextRenderOptions)}
                </div>
            ))}
        </section>
    );
}