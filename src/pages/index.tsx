import * as React from "react"
import { MDXProvider } from '@mdx-js/react'
import { Link, type HeadFC, type PageProps } from "gatsby"
import "../scss/site.scss"
import { Col, Container, ProgressBar, Row } from "react-bootstrap"
import Details from "../markdown/details.mdx"
import Links from "../markdown/links.mdx"
import Profile from "../markdown/profile.mdx"
import Employment from "../markdown/employment.mdx"
import Education from "../markdown/education.mdx"
import Languages from "../markdown/languages.mdx"
import Skills from "../markdown/skills.mdx"
import Hobbies from "../markdown/hobbies.mdx"
import Activities from "../markdown/activities.mdx"
import Avatar from "../components/Avatar"

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <p {...props} className="fw-bold" />,
}

const IndexPage: React.FC<PageProps> = ({data}) => {
  return (
    <MDXProvider components={components}>
      <Container>
        <Row>
          <Col lg="3" className="p-5 bg-dark text-light">
            <section className="mb-4">
              <Avatar />
            </section>
            <section className="mb-4">
              <Details />
            </section>
            <section className="mb-4">
              <Links />
            </section>
            <section className="mb-4">
              <Languages />
            </section>
            <section className="mb-4">
              <Skills />
            </section>
          </Col>
          <Col lg="9" className="p-5">
            <section className="mb-4">
              <Profile />
            </section>
            <section className="mb-4">
              <Employment />
            </section>
            <section>
              <Education />
            </section>
          </Col>
        </Row>
        <Row>
          <Col lg="3" className="p-5 pt-lg-0 bg-dark text-light">
            <Hobbies />
          </Col>
          <Col lg="9" className="p-5 pt-lg-0">
            <Activities />
          </Col>
        </Row>
      </Container>
    </MDXProvider>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>***REMOVED*** - Full Stack Developer</title>