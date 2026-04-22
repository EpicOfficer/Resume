import * as React from "react";
import { graphql, type PageProps } from "gatsby";
import Avatar from "../components/Avatar";
import SEO from "../components/SEO";
import { FaDownload, FaEnvelope, FaLocationDot } from "react-icons/fa6";

export const query = graphql`
    query ResumeV2 {
        contentfulResumeProfile {
            contentful_id
            node_locale
            fullName
            headline
            summary {
                summary
            }
            location
            email
            phone
            websiteUrl
            githubUrl
            linkedinUrl
            seoTitle
            seoDescription {
                seoDescription
            }
            seoKeywords
            interests
            avatar {
                gatsbyImageData(width: 180, height: 180, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                resize(width: 1200, height: 630, format: PNG) {
                    src
                }
            }
        }
        allContentfulResumeSkill(sort: { fields: [order, level], order: [ASC, DESC] }) {
            nodes {
                contentful_id
                node_locale
                name
                category
                level
                highlight
            }
        }
        allContentfulResumeLanguage(sort: { fields: order, order: ASC }) {
            nodes {
                contentful_id
                node_locale
                language
                level
            }
        }
        allContentfulResumeExperience(sort: { fields: startDate, order: DESC }) {
            nodes {
                contentful_id
                node_locale
                company
                role
                location
                startDate
                endDate
                current
                summary {
                    summary
                }
            }
        }
        allContentfulResumeProject(sort: { fields: order, order: ASC }) {
            nodes {
                contentful_id
                node_locale
                title
                year
                location
                summary {
                    summary
                }
                impact {
                    impact
                }
                url
                featured
            }
        }
        allContentfulResumeEducation(sort: { fields: [order, startDate], order: [ASC, DESC] }) {
            nodes {
                contentful_id
                node_locale
                institution
                qualification
                startDate
                endDate
                summary {
                    summary
                }
            }
        }
    }
`;

function formatDate(date: string | null | undefined) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function safeList(value: unknown): string[] {
    return Array.isArray(value) ? value.filter(Boolean).map(String) : [];
}

function dedupeByContentfulId<T extends { contentful_id?: string | null; node_locale?: string | null }>(nodes: T[], preferredLocale?: string) {
    const map = new Map<string, T>();

    for (const node of nodes) {
        const id = node?.contentful_id;
        if (!id) continue;

        const existing = map.get(id);
        if (!existing) {
            map.set(id, node);
            continue;
        }

        if (preferredLocale && node?.node_locale === preferredLocale && existing?.node_locale !== preferredLocale) {
            map.set(id, node);
        }
    }

    return [...map.values()];
}

const IndexPage = ({ data }: PageProps<any>) => {
    const profile = data?.contentfulResumeProfile;
    if (!profile) return null;

    const locale = profile.node_locale;

    const skills = dedupeByContentfulId(data?.allContentfulResumeSkill?.nodes ?? [], locale);
    const languages = dedupeByContentfulId(data?.allContentfulResumeLanguage?.nodes ?? [], locale);
    const experience = dedupeByContentfulId(data?.allContentfulResumeExperience?.nodes ?? [], locale);
    const projects = dedupeByContentfulId(data?.allContentfulResumeProject?.nodes ?? [], locale);
    const education = dedupeByContentfulId(data?.allContentfulResumeEducation?.nodes ?? [], locale);

    const profileSummary = profile.summary?.summary || "";
    const profileSeoDescription = profile.seoDescription?.seoDescription || profileSummary;

    const mainLinks = [
        profile.websiteUrl ? { name: "Website", url: profile.websiteUrl } : null,
        profile.githubUrl ? { name: "GitHub", url: profile.githubUrl } : null,
        profile.linkedinUrl ? { name: "LinkedIn", url: profile.linkedinUrl } : null,
    ].filter(Boolean) as { name: string; url: string }[];

    const heroTags = skills.slice(0, 4).map((skill: any) => skill.name).filter(Boolean);

    return (
        <>
            <SEO
                title={profile.seoTitle || `${profile.fullName} | ${profile.headline}`}
                description={profileSeoDescription}
                image={profile.avatar?.resize?.src}
                keywords={safeList(profile.seoKeywords)}
                author={profile.fullName}
                pathname="/"
            />

            <div className="resume-shell">
                <header className="hero-panel print-priority">
                    <div>
                        <Avatar name={profile.fullName} jobTitle={profile.headline} image={profile.avatar?.gatsbyImageData} />
                        <p className="hero-summary">{profileSummary}</p>
                        {!!heroTags.length && (
                            <div className="hero-tags" aria-label="Top skills">
                                {heroTags.map((tag: string) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hero-cta-group d-print-none">
                        <a className="btn btn-primary btn-lg" download="resume.pdf" href="/export.pdf">
                            <FaDownload className="me-2" /> Download PDF
                        </a>
                        {profile.email && (
                            <a className="btn btn-outline-light" href={`mailto:${profile.email}`}>
                                <FaEnvelope className="me-2" /> Contact
                            </a>
                        )}
                        {profile.location && (
                            <p className="hero-location mb-0">
                                <FaLocationDot className="me-2" /> {profile.location}
                            </p>
                        )}
                    </div>
                </header>

                <div className="resume-grid">
                    <aside className="resume-sidebar">
                        <section className="resume-card print-priority">
                            <h2 className="section-title">Details</h2>
                            <ul className="meta-list">
                                {profile.location && <li><FaLocationDot aria-hidden="true" /><span>{profile.location}</span></li>}
                                {profile.phone && <li><span>☎</span><a href={`tel:${profile.phone}`}>{profile.phone}</a></li>}
                                {profile.email && <li><FaEnvelope aria-hidden="true" /><a href={`mailto:${profile.email}`}>{profile.email}</a></li>}
                            </ul>
                        </section>

                        <section className="resume-card print-priority">
                            <h2 className="section-title">Links</h2>
                            <ul className="link-list">
                                {mainLinks.map((link) => (
                                    <li key={link.name}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a></li>
                                ))}
                            </ul>
                        </section>

                        <section className="resume-card print-priority">
                            <h2 className="section-title">Core Skills</h2>
                            <div className="skill-stack">
                                {skills.map((skill: any, idx: number) => {
                                    const pct = Math.round(((skill.level || 3) / 5) * 100);
                                    return (
                                        <div className="skill-item" key={idx}>
                                            <div className="skill-item__meta">
                                                <span className="skill-item__name">{skill.name}</span>
                                                <span className="skill-item__level">{skill.category} · {skill.level || 3}/5</span>
                                            </div>
                                            <div className="skill-item__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                                                <div className="skill-item__fill" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="resume-card print-secondary">
                            <h2 className="section-title">Languages</h2>
                            <div className="skill-stack">
                                {languages.map((lang: any, idx: number) => {
                                    const pct = Math.round(((lang.level || 3) / 5) * 100);
                                    return (
                                        <div className="skill-item" key={idx}>
                                            <div className="skill-item__meta">
                                                <span className="skill-item__name">{lang.language}</span>
                                                <span className="skill-item__level">{lang.level || 3}/5</span>
                                            </div>
                                            <div className="skill-item__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                                                <div className="skill-item__fill" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {!!safeList(profile.interests).length && (
                            <section className="resume-card print-secondary">
                                <h2 className="section-title">Interests</h2>
                                <ul className="pill-list">
                                    {safeList(profile.interests).map((x) => <li key={x}>{x}</li>)}
                                </ul>
                            </section>
                        )}
                    </aside>

                    <main className="resume-main">
                        <section className="resume-card print-priority">
                            <h2 className="section-title">Experience</h2>
                            <div className="timeline">
                                {experience.map((job: any, idx: number) => (
                                    <article key={idx} className="timeline-item">
                                        <header>
                                            <h3>{job.role}</h3>
                                            <p className="timeline-company">{job.company}</p>
                                            <p className="timeline-date">
                                                {formatDate(job.startDate)} - {job.current ? "Present" : formatDate(job.endDate)}
                                            </p>
                                        </header>
                                        {job.summary?.summary && <p className="mb-2">{job.summary.summary}</p>}
                                    </article>
                                ))}
                            </div>
                        </section>

                        {!!projects.length && (
                            <section className="resume-card print-secondary">
                                <h2 className="section-title">Projects & Initiatives</h2>
                                <div className="project-grid">
                                    {projects.map((p: any, idx: number) => (
                                        <article key={idx} className="project-card">
                                            <h3>{p.title}</h3>
                                            <p className="project-meta">{[p.location, p.year].filter(Boolean).join(" · ")}</p>
                                            {p.summary?.summary && <p>{p.summary.summary}</p>}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!!education.length && (
                            <section className="resume-card print-secondary">
                                <h2 className="section-title">Education & Certifications</h2>
                                <div className="stack-list">
                                    {education.map((ed: any, idx: number) => (
                                        <article key={idx} className="stack-list-item">
                                            <h3>{ed.institution}</h3>
                                            <p className="timeline-date">{[formatDate(ed.startDate), formatDate(ed.endDate)].filter(Boolean).join(" - ")}</p>
                                            {ed.qualification && <p>{ed.qualification}</p>}
                                            {ed.summary?.summary && <p>{ed.summary.summary}</p>}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default IndexPage;
