import { StaticImage } from "gatsby-plugin-image";
import * as React from "react"

export default function Avatar() {
    return (
        <div className="text-center">
            <StaticImage alt="***REMOVED***" src="../images/profile.png" placeholder="blurred" className="mx-5 mb-3 rounded-circle" />
            <h1>***REMOVED***</h1>
            <p>Full Stack Developer</p>
        </div>
    );
}