import * as React from "react"
import { HeadFC, Link, PageProps } from "gatsby"

const NotFoundPage: React.FC<PageProps> = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col text-center p-5">
                    <h1>Page not found</h1>
                    <p>Sorry 😔, we couldn’t find what you were looking for.</p>
                    <p><Link to="/">Go home</Link></p>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
