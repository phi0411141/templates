# AI Readiness Checklist

The yardstick for the AI Agent persona. Based on Google's AI optimization
guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

**Core principle:** there is no separate "AI SEO". Generative AI features
(AI Overviews, AI Mode, ChatGPT search, Perplexity, agentic browsers) ride on
the same crawl + index + ranking pipeline as classic search. Solid SEO and
people-first content *is* the optimization.

Mark each item **pass / fail / unknown** with evidence (URL, saved file,
snippet). Never mark pass without showing what you looked at. Items that
need tools the persona doesn't have (Search Console, CrUX, Merchant Center)
are **unknown**; list them for the user to check.

## 1. Indexability (if this fails, nothing else matters)
- [ ] Page returns HTTP 200 and is not blocked by `robots.txt`.
- [ ] No `noindex` meta tag or `X-Robots-Tag` header.
- [ ] Canonical URL is self-referential or points to an intended canonical.
- [ ] Page appears in Google's index (`site:` query or Search Console URL Inspection).
- [ ] Sitemap exists, is referenced in `robots.txt`, and lists this URL.

## 2. Crawl accessibility
- [ ] Main content is present in the rendered HTML, not gated behind a click or login.
- [ ] If JS-rendered: SSR or pre-rendered so crawlers see the main content
      without executing complex JS. Verify with `curl -A "Googlebot"`.
- [ ] Critical resources (CSS, layout JS) are not blocked by `robots.txt`.
- [ ] Internal links use real `<a href="...">`, not JS-only handlers.

## 3. Content quality (the biggest lever)
- [ ] Non-commodity perspective: first-hand experience, original data,
      expert analysis. Not a rewritten summary of competitors.
- [ ] Clear authorship and credentials where relevant (E-E-A-T).
- [ ] Last-updated date is visible and accurate.
- [ ] Headings (`h1`–`h3`) describe what each section covers; no clickbait or vague labels.
- [ ] Main content is distinguishable from nav/ads/footer (`<main>`, `<article>`).

## 4. Semantic HTML
- [ ] One `<h1>`, logical heading hierarchy.
- [ ] Lists use `<ul>`/`<ol>`, tables use `<table>` with headers, quotes use `<blockquote>`.
- [ ] Images have descriptive `alt`; figures use `<figure>`/`<figcaption>`.
- [ ] Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`.

## 5. Structured data (helpful, not required)
- [ ] Appropriate schema.org type (`Article`, `Product`, `FAQPage`, `Recipe`,
      `LocalBusiness`, `Organization`, ...).
- [ ] Validates in the [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Matches what's visible on the page (schema for invisible content is spam).

## 6. Page experience
- [ ] Mobile-responsive.
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
      ([PageSpeed Insights](https://pagespeed.web.dev/) / CrUX).
- [ ] No intrusive interstitials on first interaction.
- [ ] HTTPS with a valid certificate.

## 7. Duplicate / thin content
- [ ] No near-duplicate pages competing for the same query.
- [ ] Faceted/filter URLs are canonicalized or `noindex`ed.
- [ ] No auto-generated doorway pages.

## 8. Commerce / local (if applicable)
- [ ] Products: structured `Product` data on PDPs (price, availability, GTIN)
      consistent with the Merchant Center feed.
- [ ] Local business: claimed Google Business Profile with accurate NAP, hours, categories.

## 9. Agentic readiness
- [ ] Key actions (book, buy, contact) are reachable without JS-heavy flows where possible.
- [ ] Forms use semantic inputs (`type`, `name`, `autocomplete`) and labels.
- [ ] No CAPTCHA on read-only content pages.

## Anti-patterns to flag

- Cloaking: different content for Googlebot than for users (compare
  `curl -A "Googlebot"` with a normal user agent).
- Hidden text or keyword stuffing aimed at "AI training data".
- Auto-generated FAQ blocks padded with synonyms to catch every phrasing.
- Schema markup that doesn't match visible content.
- CSS/JS blocked in `robots.txt` (breaks rendering).
- Infinite scroll without paginated fallback URLs.

## Not findings

Don't report these as problems, and if the site does them, note they bring
no AI benefit:

- Missing `llms.txt` or other proprietary "AI-readable" files. Not used by Google.
- Content not "rewritten for LLMs" (synonym stuffing, prompt-style headings).
  Models understand language; this only degrades the page for humans.
- Long multi-topic pages not chunked into tiny fragments. Generative systems
  handle them fine; fragmentation hurts UX and crawl efficiency.
- Missing structured data on its own. It helps rich results but isn't
  required for AI surfaces (report it as a Polish-level suggestion at most).

## Fix priority

When ranking AI findings in the report, highest leverage first:

1. Indexability blockers
2. Crawl/render blockers (especially JS gates on main content)
3. Content quality (originality, depth, E-E-A-T signals)
4. Semantic HTML
5. Structured data
6. Performance / Core Web Vitals
7. Duplicate-content consolidation

## References

- Search Essentials: https://developers.google.com/search/docs/essentials
- Helpful, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
