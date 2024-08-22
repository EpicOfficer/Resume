import {graphql} from "gatsby";

export const query = graphql`
    fragment SkillFields on ContentfulSkill {
        name
        skillLevel
    }

    fragment SectionFields on ContentfulMarkdownSection {
        title
        content {
            raw
        }
    }

    fragment LanguageFields on ContentfulLanguageSection {
        language
        skillLevel
    }

    fragment EmploymentHistoryFields on ContentfulEmploymentHistorySection {
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

    fragment LinkFields on ContentfulSocialLinks {
        name
        url
    }

    fragment DetailsFields on ContentfulPersonalDetails {
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
            ...LinkFields
        }
    }

    fragment ActivitiesFields on ContentfulExtraCurricularSection {
        title
        year
        location
        fullDescription {
            raw
        }
    }

    fragment EducationFields on ContentfulEducationSection {
        startDate
        endDate
        description {
            raw
        }
        institutionName
    }

    query Portfolio {
        contentfulPortfolio {
            title
            skills { ...SkillFields }
            sections { ...SectionFields }
            languages { ...LanguageFields }
            hobbies
            employmentHistory { ...EmploymentHistoryFields }
            details { ...DetailsFields }
            activities { ...ActivitiesFields }
            education { ...EducationFields }
        }
    }
`;