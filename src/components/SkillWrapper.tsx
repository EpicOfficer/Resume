import { MDXProvider } from "@mdx-js/react";
import * as React from "react"

interface SkillWrapperProps {
    children: React.ReactNode; // this is the type for child components
}

const components = {
    p: (props: React.HTMLProps<HTMLDivElement>) => <div {...props} />,
    br: () => null, // Replace <br> with null to essentially ignore it
};

export default function SkillWrapper({ children }: SkillWrapperProps) {
    return (
      <MDXProvider components={components}>
        {children}
      </MDXProvider>
    );
}