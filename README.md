# KOSIGN homepage clone

A Next.js rebuild of the first page of https://www.kosign.com.kh/.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Layout

- `src/app/page.tsx`: assembles the page sections
- `src/components/`: one component per section, each with its own CSS Module
- `src/i18n/`: English, Khmer and Korean text, plus the language provider
- `public/`: images and logos from the original site

Only the homepage exists. Links to other pages (`/products/*`, `/company`, `/csr` and so on) keep the
original URLs and show a 404 until those pages are built.

The text, logos and images belong to KOSIGN and its partners.
