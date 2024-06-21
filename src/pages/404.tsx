import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import { Col, Container, Row } from "react-bootstrap"

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Container>
      <Row>
        <Col className="text-center p-5">
          <h1>Page not found</h1>
          <p>Sorry 😔, we couldn’t find what you were looking for.</p>
          <p><Link to="/">Go home</Link></p>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
