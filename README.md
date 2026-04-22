# Resume website

Modern, dark-themed resume site built with Gatsby + Contentful.

## Scripts

- `npm run develop` - local dev
- `npm run typecheck` - TypeScript checks
- `npm run build` - production build (also generates `public/export.pdf` via post-build hook)
- `npm run export:pdf` - generate PDF from an existing `public` build
- `npm run build:pdf` - deterministic full build and PDF export
- `npm run contentful:reconfigure` - full Contentful model+entry reconfigure (creates backup first)

## PDF export

PDF export is generated from the built site using Puppeteer and print CSS.

Recommended command:

```bash
npm run build:pdf
```

Output file:

- `public/export.pdf`

## Content

Content is pulled from Contentful. The v2 model uses:

- `resumeProfile`
- `resumeHighlight`
- `resumeSkill`
- `resumeLanguage`
- `resumeExperience`
- `resumeProject`
- `resumeEducation`

Before reconfigure, ensure `.env` includes:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_MANAGEMENT` (or `CONTENTFUL_MANAGEMENT_TOKEN`)
- `CONTENTFUL_ENVIRONMENT` (optional, defaults to `master`)

Each reconfigure run writes a backup JSON to `backups/`.

## Design notes

- Dark-first premium visual style
- Recruiter-first scan hierarchy
- Hybrid layout (cards + timeline)
- Print styles target high-impact page 1 and expanded page 2
