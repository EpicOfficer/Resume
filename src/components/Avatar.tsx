import { StaticImage } from "gatsby-plugin-image";
import * as React from "react"

interface AvatarProps {
    name: string,
    jobTitle: string,
}

export default function Avatar({name, jobTitle}: AvatarProps) {
    return (
        <div className="text-center">
            <StaticImage alt={name} src="../images/profile.png" placeholder="blurred" className="mx-5 mb-3 rounded-circle" />
            <h1>{name}</h1>
            <p>{jobTitle}</p>
        </div>
    );
}