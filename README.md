# dps-gandhinagar.in

The one-page placeholder served at **dps-gandhinagar.in** via GitHub Pages.

This branch is deliberately an orphan — it shares no history with `main` and
holds no part of the All Nighter application. GitHub Pages publishes it from
the branch root.

## Why this exists

The domain used to serve a full copy of the notes site. That copy was a stuck
Pages deployment: it could never update, it 404'd on every route added after
it, and it competed with **allnighter.in** for the same content. Duplicate
content on a second domain splits your own search authority.

So the domain now serves one page that says who owns it and where the real site
went. Every page here is `noindex, follow` — crawlers may read it and follow the
link out, but it will never rank against allnighter.in.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page. Self-contained: no build, no fonts, no requests. |
| `404.html` | The same page, so old deep links land somewhere human. |
| `CNAME` | Binds the custom domain. **Deleting this unbinds it.** |
| `robots.txt` | Allows crawling — required for `noindex` to be seen at all. |

## Changing it

Edit and push to this branch; Pages redeploys on its own. Don't merge `main`
into it, and don't delete `CNAME`.
