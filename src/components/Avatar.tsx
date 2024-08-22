import {GatsbyImage, IGatsbyImageData} from "gatsby-plugin-image";
import * as React from "react"

interface AvatarProps {
    name: string,
    jobTitle: string,
    image: IGatsbyImageData | null | undefined
}

export default function Avatar({name, jobTitle, image}: AvatarProps) {
    return (
        <section className="text-center">
            {image && (
                <GatsbyImage alt={name} image={image} class="mx-5 mb-3 rounded-circle"/>
            )}
            <h1>{name}</h1>
            <p>{jobTitle}</p>
        </section>
    );
}