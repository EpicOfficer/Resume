import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

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
  if (!res.ok) throw new Error(`${method} ${pathname} failed: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function updateEntry(entryId, mutate) {
  const entry = await api(`/entries/${entryId}`, { allow404: true });
  if (!entry) return;

  const locale = Object.keys(entry.fields?.fullName || entry.fields?.title || entry.fields?.description || { "en-GB": true })[0] || "en-GB";
  mutate(entry, locale);

  const updated = await api(`/entries/${entryId}`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(entry.sys.version) },
    body: { fields: entry.fields },
  });

  await api(`/entries/${entryId}/published`, {
    method: "PUT",
    headers: { "X-Contentful-Version": String(updated.sys.version) },
  });
}

async function main() {
  await updateEntry("resume-profile", (entry, locale) => {
    if (entry.fields?.subheadline?.[locale] && String(entry.fields.subheadline[locale]).toLowerCase().includes("denmark")) {
      delete entry.fields.subheadline;
    }
  });

  await updateEntry("highlight-3", (entry, locale) => {
    entry.fields.title = { ...(entry.fields.title || {}), [locale]: "Clear technical signal" };
    entry.fields.description = { ...(entry.fields.description || {}), [locale]: "Presentation and structure tuned for fast recruiter scanning and technical credibility." };
    entry.fields.metric = { ...(entry.fields.metric || {}), [locale]: "Concise, high-signal profile" };
  });

  console.log("Copy tuning complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
