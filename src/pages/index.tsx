import "../scss/site.scss"
import * as React from "react"
import {graphql, type PageProps} from "gatsby"
import {Col, Container, Row} from "react-bootstrap"
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

export const query = graphql`
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

const IndexPage = ({data}: PageProps<Queries.PortfolioQuery>) => {
    const portfolio = data.contentfulPortfolio!

    return (
        <Container>
            <Row>
                <Col sm={leftColumnCountSm} lg={leftColumnCountLg} className={leftColumnClassNames}>
                    <Avatar name={portfolio.details?.fullName}
                            jobTitle={portfolio.details?.jobTitle}
                            image={portfolio.details?.profileImage?.gatsbyImage} />

                    <DetailsSection details={portfolio.details}/>
                    <LinksSection links={portfolio.details?.links}/>
                    <LanguagesSection languages={portfolio.languages}/>
                    <SkillsSection skills={portfolio.skills}/>
                </Col>
                <Col className={rightColumnClassNames}>
                    <Sections sections={portfolio.sections}/>
                    <EmploymentHistorySection employmentHistory={portfolio.employmentHistory}/>
                    <EducationSection education={portfolio.education}/>
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