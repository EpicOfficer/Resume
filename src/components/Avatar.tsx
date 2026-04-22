import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import * as React from "react";

interface AvatarProps {
    name: string | null | undefined;
    jobTitle: string | null | undefined;
    image: IGatsbyImageData | null | undefined;
}

export default function Avatar({ name, jobTitle, image }: AvatarProps) {
    return (
        <section className="hero-profile">
            {image && (
                <GatsbyImage alt={name ?? "Profile image"} image={image} className="hero-avatar" />
            )}
            <div>
                <h1>{name}</h1>
                <p className="hero-role">{jobTitle}</p>
            </div>
        </section>
    );
}
