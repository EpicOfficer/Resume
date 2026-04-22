import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN || process.env.CONTENTFUL_MANAGEMENT;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN");
  process.exit(1);
}

const API_BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

async function api(pathname, { method = "GET", body, headers = {}, allow404 = false } = {}) {
  const res = await fetch(`${API_BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${MGMT_TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (allow404 && res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${pathname} failed: ${res.status} ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

async function paged(pathname, params = {}) {
  const out = [];
  let skip = 0;
  const limit = 100;
  while (true) {
    const query = new URLSearchParams({ limit: String(limit), skip: String(skip), ...params });
    const page = await api(`${pathname}?${query.toString()}`);
    out.push(...(page.items || []));
    skip += page.items?.length || 0;
    if (!page.items?.length || skip >= (page.total || 0)) break;
  }
  return out;
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "item";
}

function richTextToPlain(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  const lines = [];
  const walk = (node) => {
    if (!node) return;
    if (node.nodeType === "text" && node.value) lines.push(node.value);
    if (Array.isArray(node.content)) node.content.forEach(walk);
    if (["paragraph", "list-item"].includes(node.nodeType)) lines.push("\n");
  };
  walk(value);
  return lines.join(" ").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function bulletsFromText(text) {
  if (!text) return [];
  const lines = text.split("\n").map((x) => x.trim()).filter(Boolean);
  const bullets = lines
    .filter((line) => /^[-•]/.test(line))
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  return bullets;
}

function categoryForSkill(name = "") {
  const n = name.toLowerCase();
  if (/(react|html|css|javascript|typescript|blazor|frontend|word\s*press)/.test(n)) return "Frontend";
  if (/(c#|\.net|php|sql|api|backend|umbraco)/.test(n)) return "Backend";
  if (/(azure|docker|linux|devops|hosting|infra|network)/.test(n)) return "Infrastructure";
  if (/(test|selenium|playwright|appium|qa)/.test(n)) return "Quality";
  return "General";
}

function localeWrap(locale, fields) {
  const wrapped = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    wrapped[k] = { [locale]: v };
  }
  return { fields: wrapped };
}

async function upsertContentType(id, definition) {
  const existing = await api(`/content_types/${id}`, { allow404: true });
  const headers = existing ? { "X-Contentful-Version": String(existing.sys.version) } : {};
  const saved = await api(`/content_types/${id}`, {
    method: "PUT",
    headers,
    body: definition,
  });

  await api(`/content_types/${id}/published`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(saved.sys.version) },
  });

  return saved;
}

async function upsertEntry(id, contentTypeId, locale, fields) {
  const existing = await api(`/entries/${id}`, { allow404: true });
  const headers = {
    "X-Contentful-Content-Type": contentTypeId,
    ...(existing ? { "X-Contentful-Version": String(existing.sys.version) } : {}),
  };
  const saved = await api(`/entries/${id}`, {
    method: "PUT",
    headers,
    body: localeWrap(locale, fields),
  });

  await api(`/entries/${id}/published`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(saved.sys.version) },
  });

  return saved;
}

async function deleteEntry(id) {
  const existing = await api(`/entries/${id}`, { allow404: true });
  if (!existing) return;

  if (existing.sys.publishedVersion) {
    await api(`/entries/${id}/published`, {
      method: "DELETE",
      headers: { "X-Contentful-Version": String(existing.sys.version) },
    });

    const latest = await api(`/entries/${id}`, { allow404: true });
    if (!latest) return;

    await api(`/entries/${id}`, {
      method: "DELETE",
      headers: { "X-Contentful-Version": String(latest.sys.version) },
    });
    return;
  }

  await api(`/entries/${id}`, {
    method: "DELETE",
    headers: { "X-Contentful-Version": String(existing.sys.version) },
  });
}

function ctField(id, name, type, extra = {}) {
  return { id, name, type, localized: false, required: false, omitted: false, disabled: false, ...extra };
}

const CONTENT_TYPES = [
  {
    id: "resumeProfile",
    definition: {
      name: "Resume Profile",
      displayField: "fullName",
      fields: [
        ctField("fullName", "Full Name", "Symbol", { required: true }),
        ctField("headline", "Headline", "Symbol", { required: true }),
        ctField("subheadline", "Subheadline", "Symbol"),
        ctField("summary", "Summary", "Text"),
        ctField("location", "Location", "Symbol"),
        ctField("email", "Email", "Symbol"),
        ctField("phone", "Phone", "Symbol"),
        ctField("websiteUrl", "Website URL", "Symbol"),
        ctField("githubUrl", "GitHub URL", "Symbol"),
        ctField("linkedinUrl", "LinkedIn URL", "Symbol"),
        ctField("avatar", "Avatar", "Link", { linkType: "Asset" }),
        ctField("seoTitle", "SEO Title", "Symbol"),
        ctField("seoDescription", "SEO Description", "Text"),
        ctField("seoKeywords", "SEO Keywords", "Array", { items: { type: "Symbol" } }),
        ctField("interests", "Interests", "Array", { items: { type: "Symbol" } }),
      ],
    },
  },
  {
    id: "resumeHighlight",
    definition: {
      name: "Resume Highlight",
      displayField: "title",
      fields: [
        ctField("title", "Title", "Symbol", { required: true }),
        ctField("description", "Description", "Text", { required: true }),
        ctField("metric", "Metric", "Symbol"),
        ctField("order", "Order", "Integer"),
      ],
    },
  },
  {
    id: "resumeSkill",
    definition: {
      name: "Resume Skill",
      displayField: "name",
      fields: [
        ctField("name", "Name", "Symbol", { required: true }),
        ctField("category", "Category", "Symbol"),
        ctField("level", "Level", "Integer", { validations: [{ range: { min: 1, max: 5 } }] }),
        ctField("highlight", "Highlight", "Boolean"),
        ctField("order", "Order", "Integer"),
      ],
    },
  },
  {
    id: "resumeLanguage",
    definition: {
      name: "Resume Language",
      displayField: "language",
      fields: [
        ctField("language", "Language", "Symbol", { required: true }),
        ctField("level", "Level", "Integer", { validations: [{ range: { min: 1, max: 5 } }] }),
        ctField("order", "Order", "Integer"),
      ],
    },
  },
  {
    id: "resumeExperience",
    definition: {
      name: "Resume Experience",
      displayField: "role",
      fields: [
        ctField("company", "Company", "Symbol", { required: true }),
        ctField("role", "Role", "Symbol", { required: true }),
        ctField("location", "Location", "Symbol"),
        ctField("startDate", "Start Date", "Date"),
        ctField("endDate", "End Date", "Date"),
        ctField("current", "Current", "Boolean"),
        ctField("summary", "Summary", "Text"),
        ctField("achievements", "Achievements", "Array", { items: { type: "Symbol" } }),
        ctField("stack", "Stack", "Array", { items: { type: "Symbol" } }),
        ctField("order", "Order", "Integer"),
      ],
    },
  },
  {
    id: "resumeProject",
    definition: {
      name: "Resume Project",
      displayField: "title",
      fields: [
        ctField("title", "Title", "Symbol", { required: true }),
        ctField("slug", "Slug", "Symbol"),
        ctField("year", "Year", "Symbol"),
        ctField("location", "Location", "Symbol"),
        ctField("summary", "Summary", "Text"),
        ctField("impact", "Impact", "Text"),
        ctField("stack", "Stack", "Array", { items: { type: "Symbol" } }),
        ctField("url", "URL", "Symbol"),
        ctField("featured", "Featured", "Boolean"),
        ctField("order", "Order", "Integer"),
      ],
    },
  },
  {
    id: "resumeEducation",
    definition: {
      name: "Resume Education",
      displayField: "institution",
      fields: [
        ctField("institution", "Institution", "Symbol", { required: true }),
        ctField("qualification", "Qualification", "Symbol"),
        ctField("startDate", "Start Date", "Date"),
        ctField("endDate", "End Date", "Date"),
        ctField("summary", "Summary", "Text"),
        ctField("order", "Order", "Integer"),
      ],
    },
  },
];

async function main() {
  const locales = await paged("/locales");
  const defaultLocale = locales.find((l) => l.default)?.code || "en-US";

  const backupDir = path.join(process.cwd(), "backups");
  await fs.mkdir(backupDir, { recursive: true });

  const [contentTypes, entries, assets] = await Promise.all([
    paged("/content_types"),
    paged("/entries"),
    paged("/assets"),
  ]);

  const backupFile = path.join(backupDir, `contentful-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await fs.writeFile(backupFile, JSON.stringify({ contentTypes, entries, assets }, null, 2));
  console.log(`Backup written: ${backupFile}`);

  for (const ct of CONTENT_TYPES) {
    await upsertContentType(ct.id, ct.definition);
    console.log(`Content type upserted: ${ct.id}`);
  }

  const findOldCtId = (...candidates) => {
    for (const c of candidates) {
      const exact = contentTypes.find((ct) => ct.sys.id === c && !ct.sys.id.startsWith("resume"));
      if (exact) return exact.sys.id;
      const byName = contentTypes.find((ct) => !ct.sys.id.startsWith("resume") && ct.name.toLowerCase().includes(c.toLowerCase()));
      if (byName) return byName.sys.id;
    }
    return null;
  };

  const oldIds = {
    portfolio: findOldCtId("portfolio"),
    details: findOldCtId("personalDetails", "personal details", "details"),
    skill: findOldCtId("skill"),
    language: findOldCtId("language"),
    employment: findOldCtId("employmentHistorySection", "employment"),
    education: findOldCtId("educationSection", "education"),
    socialLinks: findOldCtId("socialLinks", "social links", "sociallinks"),
    extra: findOldCtId("extraCurricularSection", "extra-curricular", "extra curricular", "extra"),
  };

  const byCt = Object.create(null);
  for (const entry of entries) {
    const ct = entry?.sys?.contentType?.sys?.id;
    if (!ct) continue;
    if (!byCt[ct]) byCt[ct] = [];
    byCt[ct].push(entry);
  }

  const first = (id) => (id && byCt[id] && byCt[id][0]) || null;
  const list = (id) => (id && byCt[id]) || [];
  const fv = (entry, fieldId) => {
    const field = entry?.fields?.[fieldId];
    if (!field || typeof field !== "object") return undefined;
    return field[defaultLocale] ?? field[Object.keys(field)[0]];
  };

  const portfolio = first(oldIds.portfolio);
  const details = first(oldIds.details);
  const skills = list(oldIds.skill);
  const languages = list(oldIds.language);
  const employment = list(oldIds.employment);
  const education = list(oldIds.education);
  const socialLinks = list(oldIds.socialLinks);
  const projects = list(oldIds.extra);

  const linksByName = Object.fromEntries(
    socialLinks.map((entry) => [String(fv(entry, "name") || "").toLowerCase(), fv(entry, "url")])
  );

  const fullName = fv(details, "fullName") || "";
  const headline = fv(details, "jobTitle") || "Full Stack Engineer";
  const portfolioDescription = fv(portfolio, "description");
  const summary = portfolioDescription?.description ||
    richTextToPlain(portfolioDescription) ||
    "Full stack engineer focused on clean delivery across web, backend, and infrastructure.";

  const profileFields = {
    fullName,
    headline,
    subheadline: "",
    summary,
    location: fv(details, "location") || "",
    email: fv(details, "email") || "",
    phone: fv(details, "phone") || "",
    websiteUrl: linksByName.website || "",
    githubUrl: linksByName.github || "",
    linkedinUrl: linksByName.linkedin || "",
    avatar: fv(details, "profileImage") || undefined,
    seoTitle: `${fullName} | Full Stack Engineer`,
    seoDescription: summary,
    seoKeywords: (fv(portfolio, "keywords") || []).filter(Boolean),
    interests: (fv(portfolio, "hobbies") || []).filter(Boolean),
  };

  await upsertEntry("resume-profile", "resumeProfile", defaultLocale, profileFields);
  console.log("Entry upserted: resume-profile");

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    const name = fv(s, "name");
    if (!name) continue;
    const level = Number(fv(s, "skillLevel") || 3);
    const id = `skill-${slugify(name)}-${i + 1}`;
    await upsertEntry(id, "resumeSkill", defaultLocale, {
      name,
      category: categoryForSkill(name),
      level,
      highlight: level >= 4,
      order: i + 1,
    });
  }
  console.log(`Entries upserted: ${skills.length} skills`);

  const desiredLanguageIds = new Set();
  for (let i = 0; i < languages.length; i++) {
    const l = languages[i];
    const language = fv(l, "language");
    if (!language) continue;
    const languageId = `language-${slugify(language)}`;
    desiredLanguageIds.add(languageId);
    await upsertEntry(languageId, "resumeLanguage", defaultLocale, {
      language,
      level: Number(fv(l, "skillLevel") || 3),
      order: i + 1,
    });
  }
  console.log(`Entries upserted: ${languages.length} languages`);

  const existingResumeLanguages = await paged("/entries", { content_type: "resumeLanguage" });
  for (const entry of existingResumeLanguages) {
    if (!desiredLanguageIds.has(entry.sys.id)) {
      await deleteEntry(entry.sys.id);
      console.log(`Removed duplicate/obsolete resumeLanguage entry: ${entry.sys.id}`);
    }
  }

  for (let i = 0; i < employment.length; i++) {
    const e = employment[i];
    const role = fv(e, "jobTitle");
    const companyValue = fv(e, "companyName");
    const company = typeof companyValue === "string" ? companyValue : (companyValue?.companyName || "");
    if (!role || !company) continue;
    const summaryText = richTextToPlain(fv(e, "description"));
    const achievements = bulletsFromText(summaryText);

    await upsertEntry(`experience-${slugify(company)}-${slugify(role)}-${i + 1}`, "resumeExperience", defaultLocale, {
      company,
      role,
      location: "",
      startDate: fv(e, "startDate") || undefined,
      endDate: fv(e, "endDate") || undefined,
      current: !fv(e, "endDate"),
      summary: summaryText,
      achievements,
      stack: [],
      order: i + 1,
    });
  }
  console.log(`Entries upserted: ${employment.length} experience`);

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const title = fv(p, "title");
    if (!title) continue;
    const impactText = richTextToPlain(fv(p, "fullDescription"));

    await upsertEntry(`project-${slugify(title)}-${i + 1}`, "resumeProject", defaultLocale, {
      title,
      slug: slugify(title),
      year: fv(p, "year") ? String(fv(p, "year")) : "",
      location: fv(p, "location") || "",
      summary: impactText,
      impact: "",
      stack: [],
      url: "",
      featured: i < 2,
      order: i + 1,
    });
  }
  console.log(`Entries upserted: ${projects.length} projects`);

  for (let i = 0; i < education.length; i++) {
    const ed = education[i];
    const institution = fv(ed, "institutionName");
    if (!institution) continue;
    const summaryText = richTextToPlain(fv(ed, "description"));

    await upsertEntry(`education-${slugify(institution)}-${i + 1}`, "resumeEducation", defaultLocale, {
      institution,
      qualification: "",
      startDate: fv(ed, "startDate") || undefined,
      endDate: fv(ed, "endDate") || undefined,
      summary: summaryText,
      order: i + 1,
    });
  }
  console.log(`Entries upserted: ${education.length} education`);

  const highlights = [
    {
      title: "Full-stack plus infrastructure breadth",
      description: "Hands-on delivery across application engineering, cloud services, and operational infrastructure.",
      metric: "Multi-discipline delivery",
    },
    {
      title: "Production-focused engineering",
      description: "Clean, testable implementations with practical architecture and maintainable systems thinking.",
      metric: "Reliability-first approach",
    },
    {
      title: "Clear technical signal",
      description: "Profile and presentation tuned for fast recruiter scanning and technical credibility.",
      metric: "Concise, high-signal profile",
    },
  ];

  for (let i = 0; i < highlights.length; i++) {
    await upsertEntry(`highlight-${i + 1}`, "resumeHighlight", defaultLocale, {
      ...highlights[i],
      order: i + 1,
    });
  }

  console.log("Contentful full reconfigure complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
