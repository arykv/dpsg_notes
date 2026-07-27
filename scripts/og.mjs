/**
 * Open Graph cards, one per route.
 *
 * For most of the times this site gets shared — a WhatsApp message to a friend
 * the night before a paper — the link preview *is* the product. One generic
 * image sitewide wastes that, so every route gets a card that says what's
 * actually on it, and leads with a number wherever there is one.
 *
 * Built as SVG and rasterised with resvg. Two things make that reliable:
 *
 * 1. The fonts are pinned static instances of the three variable families the
 *    site uses, subset to Latin and renamed to unique families (OGDisplay,
 *    OGSans, …) so the renderer can't pick the wrong weight. See og-assets/.
 * 2. SVG has no text wrapping, so lines are broken here — using real glyph
 *    advances exported from those same fonts, not an average-width guess.
 *    A headline that overflows is invisible until someone shares it.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const here = dirname(fileURLToPath(import.meta.url))
const assets = join(here, 'og-assets')

const WIDTH = 1200
const HEIGHT = 630

/* --- Palette. The register, at poster size. ------------------------------- */

const C = {
  ground: '#052e27',
  rule: '#0d3b32',
  pen: '#e4574a',
  mark: '#f2a93b',
  text: '#f1ede0',
  muted: '#a9bfb4',
  faint: '#7e988c',
  line: '#17564a',
}

/* --- Text measurement ----------------------------------------------------- */

const metrics = JSON.parse(await readFile(join(assets, 'og-metrics.json'), 'utf8'))

/** Width of a string in px, from real advance widths. */
function measure(text, family, size) {
  const m = metrics[family]
  if (!m) throw new Error(`No metrics for font family "${family}"`)
  let units = 0
  for (const ch of text) {
    const adv = m.advance[ch]
    if (adv === undefined) {
      // A character we didn't subset would render as .notdef — better to fail
      // the build than to ship a card full of boxes.
      throw new Error(`Character ${JSON.stringify(ch)} is not in the ${family} subset`)
    }
    units += adv
  }
  return (units / m.unitsPerEm) * size
}

/** Greedy line breaking to a maximum width. */
function wrap(text, family, size, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && measure(candidate, family, size) > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

/**
 * Shrink the headline until it fits the space it's given. Long titles are the
 * normal case here, not the exception, so the type scale has to yield.
 */
function fitHeadline(text, maxWidth, maxLines, startSize, minSize) {
  for (let size = startSize; size >= minSize; size -= 2) {
    const lines = wrap(text, 'OGDisplay', size, maxWidth)
    if (lines.length <= maxLines) return { lines, size }
  }
  return { lines: wrap(text, 'OGDisplay', minSize, maxWidth).slice(0, maxLines), size: minSize }
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* --- The card ------------------------------------------------------------- */

function card({ kicker, headline, stat, statLabel }) {
  const PAD = 84
  const MARGIN = 118 // content starts right of the red margin line
  const contentWidth = WIDTH - MARGIN - PAD

  // The ruling, on the same 30px rhythm as the site, scaled for a 1200px card.
  const rules = []
  for (let y = 0; y < HEIGHT; y += 42) {
    rules.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${C.rule}" stroke-width="1"/>`)
  }

  // A stat, when there is one, is the loudest thing on the card.
  const statSize = 150
  const statBlock = stat
    ? `<text x="${MARGIN}" y="322" font-family="OGDisplay" font-size="${statSize}" fill="${C.mark}">${esc(stat)}</text>
       <text x="${MARGIN + measure(stat, 'OGDisplay', statSize) + 24}" y="322" font-family="OGMono" font-size="26" letter-spacing="3.4" fill="${C.faint}">${esc((statLabel ?? '').toUpperCase())}</text>`
    : ''

  const maxLines = stat ? 2 : 3
  const { lines, size } = fitHeadline(headline, contentWidth, maxLines, stat ? 54 : 76, 34)
  const lineHeight = Math.round(size * 1.14)

  // With a stat above it the headline hangs off that; without one it has the
  // whole middle of the card, so centre it there rather than leaving a hole.
  const BAND_TOP = 215
  const BAND_BOTTOM = 505
  const blockHeight = (lines.length - 1) * lineHeight + size
  const headTop = stat
    ? 400
    : Math.round(BAND_TOP + (BAND_BOTTOM - BAND_TOP - blockHeight) / 2 + size * 0.78)

  const headBlock = lines
    .map(
      (l, i) =>
        `<text x="${MARGIN}" y="${headTop + i * lineHeight}" font-family="OGDisplay" font-size="${size}" fill="${C.text}">${esc(l)}</text>`,
    )
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.ground}"/>
    ${rules.join('\n    ')}

    <!-- The red margin line every Indian school notebook has. -->
    <line x1="${MARGIN - 34}" y1="0" x2="${MARGIN - 34}" y2="${HEIGHT}" stroke="${C.pen}" stroke-width="2" opacity="0.5"/>

    <!-- Wordmark -->
    <rect x="${MARGIN}" y="${PAD - 26}" width="52" height="34" rx="4" fill="none" stroke="${C.line}" stroke-width="1.5"/>
    <text x="${MARGIN + 12}" y="${PAD - 2}" font-family="OGMono" font-size="18" fill="${C.mark}">AN</text>
    <text x="${MARGIN + 68}" y="${PAD - 2}" font-family="OGSansBold" font-size="21" fill="${C.text}">All Nighter</text>

    <!-- Kicker -->
    <text x="${MARGIN}" y="${PAD + 88}" font-family="OGMono" font-size="24" letter-spacing="3.6" fill="${C.faint}">${esc(kicker.toUpperCase())}</text>

    ${statBlock}
    ${headBlock}

    <line x1="${MARGIN}" y1="${HEIGHT - PAD - 34}" x2="${WIDTH - PAD}" y2="${HEIGHT - PAD - 34}" stroke="${C.line}" stroke-width="1"/>
    <text x="${MARGIN}" y="${HEIGHT - PAD + 4}" font-family="OGMono" font-size="23" fill="${C.muted}">allnighter.in</text>
    <text x="${WIDTH - PAD}" y="${HEIGHT - PAD + 4}" text-anchor="end" font-family="OGSans" font-size="23" fill="${C.faint}">Free · No login · No ads</text>
  </svg>`
}

/* --- Render --------------------------------------------------------------- */

const fontFiles = ['og-display.ttf', 'og-sans.ttf', 'og-sans-bold.ttf', 'og-mono.ttf'].map((f) =>
  join(assets, f),
)

/** `/chapters/class-10` → `chapters-class-10`; `/` → `home`. */
export const ogSlug = (path) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-'))

export async function buildOgImages(pages, outDir) {
  await mkdir(outDir, { recursive: true })
  const built = []

  for (const page of pages) {
    if (!page.og) throw new Error(`Page ${page.path} has no og card defined`)

    const svg = card(page.og)
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: WIDTH },
      font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'OGSans' },
    })
    const png = resvg.render().asPng()

    const name = `${ogSlug(page.path)}.png`
    await writeFile(join(outDir, name), png)
    built.push({ name, kb: png.length / 1024 })
  }

  return built
}
