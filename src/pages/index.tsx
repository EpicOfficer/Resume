import * as React from "react"
import { graphql, type PageProps } from "gatsby"
import Avatar from "../components/Avatar"
import DetailsSection from "../components/DetailsSection";
import LinksSection from "../components/LinksSection";
import LanguagesSection from "../components/LanguagesSection";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import EmploymentHistorySection from "../components/EmploymentHistorySection";
import HobbiesSection from "../components/HobbiesSection";
import ActivitiesSection from "../components/ActivitiesSection";
import Sections from "../components/Sections";
import SEO from "../components/SEO";
import { sanitizeTitle } from "../utils/sanitizeTitle";
import {handleKeywords} from "../utils/handleKeywords";
import { FaDownload } from "react-icons/fa6";

export const query = graphql`
    query Portfolio {
        contentfulPortfolio {
            title,
            description { description },
            keywords,
            skills { ...SkillFields }
            sections { ...SectionFields }
            languages { ...LanguageFields }
            hobbies
            employmentHistory { ...EmploymentHistoryFields }
            details { ...DetailsFields }
            activities { ...ActivitiesFields }
            education { ...EducationFields }
        }
    }
`

const leftColumnClassNames = "col-lg-4 col-xxl-3 p-4 p-xl-5 pb-2 bg-dark text-light";
const rightColumnClassNames = "col p-4 p-xl-5 pb-2";

const IndexPage = ({data}: PageProps<Queries.PortfolioQuery>) => {
    const portfolio = data.contentfulPortfolio!

    return (
        <>
            <SEO title={portfolio.title?.trim() ?? "Resume"}
                 description={portfolio.description?.description}
                 image={portfolio.details?.socialImage?.resize?.src}
                 keywords={handleKeywords(portfolio.keywords)}
                 author={portfolio.details?.fullName}
                />
            <div className="container">
                <div className="row">
                    <div className={leftColumnClassNames}>
                        <Avatar name={portfolio.details?.fullName}
                                jobTitle={portfolio.details?.jobTitle}
                                image={portfolio.details?.profileImage?.gatsbyImageData}/>

                        <a className="btn btn-outline-light btn-sm mb-4 w-100 d-print-none d-flex align-items-center justify-content-center"
                           download={sanitizeTitle(portfolio.title) + ".pdf"}
                           href="/export.pdf">
                            <FaDownload className="me-2" />
                            Download PDF
                        </a>

                        <DetailsSection details={portfolio.details}/>
                        <LinksSection links={portfolio.details?.links}/>
                        <LanguagesSection languages={portfolio.languages}/>
                        <SkillsSection skills={portfolio.skills}/>
                    </div>
                    <div className={rightColumnClassNames}>
                        <Sections sections={portfolio.sections}/>
                        <EmploymentHistorySection employmentHistory={portfolio.employmentHistory}/>
                        <EducationSection education={portfolio.education}/>
                    </div>
                </div>
                <div className="row">
                    <div className={leftColumnClassNames}>
                        <HobbiesSection hobbies={portfolio.hobbies}/>
                    </div>
                    <div className={rightColumnClassNames}>
                        <ActivitiesSection activities={portfolio.activities}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IndexPage