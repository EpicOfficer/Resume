import "../scss/site.scss"

import * as React from "react"
import { type HeadFC, type PageProps } from "gatsby"
import { graphql } from "gatsby"
import { Col, Container, Row } from "react-bootstrap"

import Skill from "../components/Skill"
import Avatar from "../components/Avatar"

import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { formatDate } from "../utils/dateUtils"

const IndexPage = ({data}: PageProps<Queries.PortfolioQueryQuery>) => {
  const portfolio = data.contentfulPortfolio!
  
  return (
    <Container>
      <Row>
        <Col lg="3" sm="4" className="p-4 pb-2 p-sm-3 p-lg-4 p-xl-5 bg-dark text-light">
          <Avatar name={portfolio.details?.fullName ?? ""}
                  jobTitle={portfolio.details?.jobTitle ?? ""}
                  image={portfolio.details?.profileImage?.gatsbyImage}/>

          <h2>Details</h2>
          <p>
            {portfolio.details?.location}<br/>
            <a href={'tel:'+portfolio.details?.phone}>{portfolio.details?.phone}</a><br/>
            <a href={'mailto:'+portfolio.details?.email}>{portfolio.details?.email}</a>
          </p>
          
          <h2>Links</h2>
          <p>
            {portfolio.details?.links?.map((link) => (
              <><a href={link?.url ?? ""}>{link?.name}</a><br/></>
            ))}
          </p>

          <h2>Languages</h2>
          {portfolio.languages?.map((lang) => (
            <Skill level={lang?.skillLevel ?? 0}>{lang?.language}</Skill>
          ))}

          <h2>Skills</h2>
          {portfolio.skills?.map((skill) => (
            <Skill level={skill?.skillLevel ?? 0}>{skill?.name}</Skill>
          ))}
        </Col>
        <Col lg="9" sm="8" className="p-4 pb-2 p-sm-3 p-lg-4 p-xl-5">
          {portfolio.sections?.map((section) => (
            <>
              <h2>{section?.title}</h2>
              {section?.content?.raw && documentToReactComponents(JSON.parse(section.content.raw))}
            </>
          ))}

          <h2>Employment History</h2>
          {portfolio.employmentHistory?.map((job) => (
            <>
              <h3>{job?.jobTitle}, {job?.companyName?.companyName}</h3>
              <h4>{formatDate(job?.startDate)} - {formatDate(job?.endDate)}</h4>
              {job?.description?.raw && documentToReactComponents(JSON.parse(job.description.raw))}
            </>
          ))}

          <h2>Education</h2>
          {portfolio.education?.map((edu) => (
            <>
              <h3>{edu?.institutionName}</h3>
              <h4>
                {formatDate(edu?.startDate)}
                {edu?.endDate && " - " + formatDate(edu?.endDate)}
              </h4>
              <p>
                {edu?.description?.raw && documentToReactComponents(JSON.parse(edu.description.raw))}
              </p>
            </>
          ))}
        </Col>
      </Row>
      <Row>
        <Col lg="3" sm="4" className="p-4 pb-0 p-sm-3 p-lg-4 p-xl-5 pt-lg-0 pt-xl-0 bg-dark text-light">
          <h2>Hobbies</h2>
          <p>
            {portfolio.hobbies?.map((hobby) => (
              <>{hobby} <br/></>
            ))}
          </p>
        </Col>
        <Col lg="9" sm="8" className="p-4 p-sm-3 p-lg-4 p-xl-5 pt-lg-0 pt-xl-0">
          <h2>Extra-curricular Activities</h2>
          {portfolio.activities?.map((activity) => (
            <>
              <h3>{activity?.title}</h3>
              <h4>{activity?.year}</h4>
              <p>
                {activity?.fullDescription?.raw && documentToReactComponents(JSON.parse(activity.fullDescription.raw))}
              </p>
            </>
          ))}
        </Col>
      </Row>
    </Container>
  )
}

export const query = graphql`
  query PortfolioQuery {
    contentfulPortfolio {
      title
      skills {
        name
        skillLevel
      }
      sections {
        title
        content {
          raw
        }
      }
      languages {
        language
        skillLevel
      }
      hobbies
      employmentHistory {
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
      details {
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
          name
          url
        }
      }
      activities {
        title
        year
        location
        fullDescription {
          raw
        }
      }
      education {
        startDate
        endDate
        description {
          raw
        }
        institutionName
      }
    }
  }
`

export default IndexPage

export const Head: HeadFC = () => <title>***REMOVED***</title>