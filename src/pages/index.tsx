import "../scss/site.scss"
import * as React from "react"
import {graphql, type PageProps} from "gatsby"
import {Col, Container, Row} from "react-bootstrap"
import Avatar from "../components/Avatar"
import {documentToReactComponents} from "@contentful/rich-text-react-renderer"
import {formatDate} from "../utils/dateUtils"
import DetailsSection from "../components/DetailsSection";
import LinksSection from "../components/LinksSection";
import LanguagesSection from "../components/LanguagesSection";
import SkillsSection from "../components/SkillsSection";
import EducationSection from "../components/EducationSection";
import EmploymentHistorySection from "../components/EmploymentHistorySection";
import HobbiesSection from "../components/HobbiesSection";
import ActivitiesSection from "../components/ActivitiesSection";

export const query = graphql`
    fragment SkillFields on ContentfulSkill {
        name
        skillLevel
    }
    
    fragment SectionFields on ContentfulMarkdownSection {
        title
        content {
            raw
        }
    }
    
    fragment LanguageFields on ContentfulLanguageSection {
        language
        skillLevel
    }
    
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
    
    fragment LinkFields on ContentfulSocialLinks {
        name
        url
    }
    
    fragment DetailsFields on ContentfulPersonalDetails {
        email
        fullName
        jobTitle
        location
        phone
        profileImage {
            gatsbyImage(width: 160, height: 160)
            file {
                details {
                    image {
                        width
                        height
                    }
                }
            }
        }
        links {
            ...LinkFields
        }
    }
    
    fragment ActivitiesFields on ContentfulExtraCurricularSection {
        title
        year
        location
        fullDescription {
            raw
        }
    }
    
    fragment EducationFields on ContentfulEducationSection {
        startDate
        endDate
        description {
            raw
        }
        institutionName
    }
    
    query Portfolio {
        contentfulPortfolio {
            title
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

const leftColumnClassNames = "p-4 pb-2 p-sm-3 p-lg-4 p-xl-5 bg-dark text-light";
const rightColumnClassNames = "p-4 pb-2 p-sm-3 p-lg-4 p-xl-5";
const leftColumnCountSm = 4;
const leftColumnCountLg = 3;

export const Head = ({data}: PageProps<Queries.PortfolioQuery>) => (
    <title>{data.contentfulPortfolio?.title ?? "Resume"}</title>
);

const renderSections = (sections) => {
    return sections?.map((section, index) => (
        <section key={index}>
            <h2>{section?.title}</h2>
            {section?.content?.raw && documentToReactComponents(JSON.parse(section.content.raw))}
        </section>
    ));
};

const IndexPage = ({data}: PageProps<Queries.PortfolioQuery>) => {
    const portfolio = data.contentfulPortfolio!
    
    return (
        <Container>
            <Row>
                <Col sm={leftColumnCountSm} lg={leftColumnCountLg} className={leftColumnClassNames}>
                    <Avatar name={portfolio.details?.fullName ?? ""}
                            jobTitle={portfolio.details?.jobTitle ?? ""}
                            image={portfolio.details?.profileImage?.gatsbyImage}/>

                    <DetailsSection details={portfolio.details} />
                    <LinksSection links={portfolio.details?.links} />
                    <LanguagesSection languages={portfolio.languages} />
                    <SkillsSection skills={portfolio.skills} />
                </Col>
                <Col className={rightColumnClassNames}>
                    {renderSections(portfolio.sections)}

                    <EmploymentHistorySection employmentHistory={portfolio.employmentHistory} />
                    <EducationSection education={portfolio.education} />
                </Col>
            </Row>
            <Row>
                <Col sm={leftColumnCountSm} lg={leftColumnCountLg} className={leftColumnClassNames}>
                    <HobbiesSection hobbies={portfolio.hobbies}/>
                </Col>
                <Col className={rightColumnClassNames}>
                    <ActivitiesSection activities={portfolio.activities}/>
                </Col>
            </Row>
        </Container>
    )
}

export default IndexPage