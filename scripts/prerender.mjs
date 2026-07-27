/**
 * Turns the built SPA into a set of real HTML documents.
 *
 * Run after `vite build` and the SSR build. For every route it renders the app
 * to HTML, drops in that page's title/description/canonical, and writes
 * `dist/<route>/index.html`. It also emits sitemap.xml.
 *
 * The client still hydrates and takes over navigation — this only changes what
 * arrives in the first response, which is the part crawlers read.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')

const { render, PAGES, SITE } = await import(join(dist, 'server', 'entry-server.js'))

const template = await readFile(join(dist, 'index.html'), 'utf8')

/** Escapes a value for use inside a double-quoted HTML attribute. */
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function withMeta(html, page, appHtml) {
  const url = SITE.origin + page.path
  let out = html

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${attr(page.title)}</title>`)
  out = out.replace(
    /<meta\s+name="description"[\s\S]*?\/?>/,
    `<meta name="description" content="${attr(page.description)}" />`,
  )
  out = out.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${attr(url)}" />`,
  )
  out = out.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${attr(page.title)}" />`,
  )
  out = out.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${attr(page.description)}" />`,
  )
  out = out.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${attr(url)}" />`,
  )

  out = out.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(schemaFor(page))}</script>\n  </head>`)

  return out.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
}

/**
 * Structured data, so search engines understand what each page is rather than
 * inferring it from the copy. The site-wide graph declares the search box;
 * per-page nodes describe what that page holds.
 */
function schemaFor(page) {
  const url = SITE.origin + page.path

  const site = {
    '@type': 'WebSite',
    '@id': SITE.origin + '/#website',
    url: SITE.origin,
    name: SITE.name,
    description: PAGES[0].description,
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: SITE.origin + '/library?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  }

  const webPage = {
    '@type': 'WebPage',
    '@id': url + '#page',
    url,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': SITE.origin + '/#website' },
    inLanguage: 'en-IN',
    about: {
      '@type': 'EducationalOrganization',
      name: 'Delhi Public School, Gandhinagar',
    },
  }

  // Breadcrumbs on anything below the root.
  if (page.path !== '/') {
    webPage.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.origin },
        { '@type': 'ListItem', position: 2, name: page.title.split(' — ')[0], item: url },
      ],
    }
  }

  return { '@context': 'https://schema.org', '@graph': [site, webPage] }
}

let written = 0
for (const page of PAGES) {
  const appHtml = await render(page.path)
  const html = withMeta(template, page, appHtml)

  const outDir = page.path === '/' ? dist : join(dist, page.path)
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), html)
  written++
  console.log(`  ${page.path.padEnd(12)} ${(html.length / 1024).toFixed(0)} kB`)
}

// The 404 fallback keeps clean URLs working on GitHub Pages for anything not
// prerendered above (individual notes, filtered library views).
await writeFile(join(dist, '404.html'), await readFile(join(dist, 'index.html'), 'utf8'))

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => `  <url>
    <loc>${SITE.origin}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

console.log(`\nPrerendered ${written} routes + sitemap.xml`)
