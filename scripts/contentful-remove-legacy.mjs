import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT(_TOKEN)");
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
    const items = page.items || [];
    out.push(...items);
    skip += items.length;
    if (!items.length || skip >= (page.total || 0)) break;
  }
  return out;
}

async function deleteEntry(id) {
  const existing = await api(`/entries/${id}`, { allow404: true });
  if (!existing) return;

  if (existing.sys.publishedVersion) {
    await api(`/entries/${id}/published`, {
      method: "DELETE",
      headers: { "X-Contentful-Version": String(existing.sys.version) },
    });
  }

  const latest = await api(`/entries/${id}`, { allow404: true });
  if (!latest) return;

  await api(`/entries/${id}`, {
    method: "DELETE",
    headers: { "X-Contentful-Version": String(latest.sys.version) },
  });
}

async function deleteContentType(id) {
  const existing = await api(`/content_types/${id}`, { allow404: true });
  if (!existing) return;

  if (existing.sys.publishedVersion) {
    await api(`/content_types/${id}/published`, {
      method: "DELETE",
      headers: { "X-Contentful-Version": String(existing.sys.version) },
    });
  }

  const latest = await api(`/content_types/${id}`, { allow404: true });
  if (!latest) return;

  await api(`/content_types/${id}`, {
    method: "DELETE",
    headers: { "X-Contentful-Version": String(latest.sys.version) },
  });
}

const LEGACY_CONTENT_TYPES = [
  "portfolio",
  "personalDetails",
  "skill",
  "languageSection",
  "employmentHistorySection",
  "educationSection",
  "socialLinks",
  "extraCurricularSection",
  "markdownSection",
];

async function main() {
  for (const ctId of LEGACY_CONTENT_TYPES) {
    const entries = await paged("/entries", { content_type: ctId });
    if (entries.length) {
      console.log(`Deleting ${entries.length} entries for legacy type ${ctId}...`);
      for (const entry of entries) {
        await deleteEntry(entry.sys.id);
        console.log(` - deleted entry ${entry.sys.id}`);
      }
    }
  }

  for (const ctId of LEGACY_CONTENT_TYPES) {
    await deleteContentType(ctId);
    console.log(`Deleted content type (if existed): ${ctId}`);
  }

  console.log("Legacy Contentful model cleanup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
