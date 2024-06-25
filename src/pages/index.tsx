import "../scss/site.scss"

import * as React from "react"
import { MDXProvider } from '@mdx-js/react'
import { type HeadFC, type PageProps } from "gatsby"
import { Col, Container, Row } from "react-bootstrap"

import SkillWrapper from "../components/SkillWrapper"
import Skill from "../components/Skill"
import Avatar from "../components/Avatar"
import PrintOnly from "../components/PrintOnly"

import Details from "../markdown/details.mdx"
import Links from "../markdown/links.mdx"
import Profile from "../markdown/profile.mdx"
import Employment from "../markdown/employment.mdx"
import Education from "../markdown/education.mdx"
import Languages from "../markdown/languages.mdx"
import Skills from "../markdown/skills.mdx"
import Hobbies from "../markdown/hobbies.mdx"
import Activities from "../markdown/activities.mdx"

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <p {...props} className="fw-bold" />,
  Skill: Skill,
  PrintOnly: PrintOnly,
  // Pass a layout (using the special `'wrapper'` key).
  wrapper({...rest}) {
    return <section className="mb-4" {...rest} />
  },
}

const name = "***REMOVED***";
const jobTitle = "Full Stack Developer";

const IndexPage: React.FC<PageProps> = ({data}) => {
  return (
    <MDXProvider components={components}>
      <Container>
        <Row>
          <Col lg="3" sm="4" className="p-4 pb-2 p-sm-3 p-lg-4 p-xl-5 bg-dark text-light">
            <Avatar name={name} jobTitle={jobTitle} />
            <Details />
            <Links />
            <SkillWrapper>
              <Languages />
              <Skills />
            </SkillWrapper>
          </Col>
          <Col lg="9" sm="8" className="p-4 pb-2 p-sm-3 p-lg-4 p-xl-5">
            <Profile />
            <Employment />
            <Education />
          </Col>
        </Row>
        <Row>
          <Col lg="3" sm="4" className="p-4 pb-0 p-sm-3 p-lg-4 p-xl-5 pt-lg-0 pt-xl-0 bg-dark text-light">
            <Hobbies />
          </Col>
          <Col lg="9" sm="8" className="p-4 p-sm-3 p-lg-4 p-xl-5 pt-lg-0 pt-xl-0">
            <Activities />
          </Col>
        </Row>
      </Container>
    </MDXProvider>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>{name} - {jobTitle}</title>