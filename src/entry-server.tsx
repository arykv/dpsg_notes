import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

export { PAGES, SITE, ogImageFor } from './lib/seo'

/**
 * Renders one route to HTML at build time.
 *
 * The site is a single-page app, which means crawlers were served an empty
 * `<div id="root">` and had to run JavaScript to see anything. Prerendering
 * gives every route a real HTML document — the chapter names, the subject
 * lists, the copy — so it can be indexed without that step.
 *
 * Routes are code-split with `React.lazy`, and `renderToString` can't wait on a
 * suspended component: the first pass renders the loading skeleton and, as a
 * side effect, starts the import. Rendering again once those promises settle
 * produces the real markup. The loop is a guard against a chunk that never
 * resolves, not an expectation of needing all four passes.
 */
export async function render(url: string): Promise<string> {
  let html = ''

  for (let pass = 0; pass < 4; pass++) {
    html = renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
    )
    if (!isSkeleton(html)) return html
    // Let the dynamic imports that pass kicked off resolve.
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return html
}

/** The route fallback is two pulsing bars and no page content. */
function isSkeleton(html: string): boolean {
  return html.includes('animate-pulse')
}
