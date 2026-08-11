# neobydesign

The site behind **www.neobydesign.com** — a portfolio plus client landing pages,
served from one repo.

Static HTML/CSS/JS. No build step, no dependencies. GitHub Pages serves the repo
root, so **the folder layout _is_ the URL structure**.

---

## Layout

```
/                          index.html            portfolio home
                           404.html  CNAME
├── assets/                PORTFOLIO assets only
│   ├── img/               site chrome, company logos, portrait, favicon
│   │   └── logos/         resume logos (svg)
│   ├── docs/              resume pdf
│   ├── cards/             home page project cards
│   ├── fonts/
│   ├── tamagotchi/        easter-egg sprites
│   ├── presentations/
│   └── work/              per-case-study imagery
│       ├── drsquatch/  beachbody/  american-century/
│       └── ring/  bodi-interactive/
│
├── shared/                css + js used across portfolio pages
│
├── work/                  CASE STUDIES
│   ├── drsquatch/index.html          -> /work/drsquatch/
│   ├── beachbody/index.html
│   ├── american-century/index.html
│   ├── ring/index.html
│   └── bodi-interactive/index.html
├── about/index.html       -> /about/
├── overview/  summary/    long-form résumé pages
├── tama/                  easter egg (no inbound links)
│
├── menerals/              CLIENT LANDING PAGES — one folder each,
├── cleanguy/              fully self-contained, own assets/
├── cleanguy-ourstory/
│
├── *.html (root)          redirect stubs for old URLs — do not add more
└── _source/               NOT DEPLOYED (gitignored) — drafts, archive,
                           design source, client build sources, notes
```

---

## Two rules

**1. Portfolio paths are root-absolute.** Always `/assets/...` and `/shared/...`,
never `assets/...`. This is what lets a page move without breaking. If you write
a relative asset path, the page stops working the moment it moves.

**2. Client landing pages are self-contained.** A client folder owns its own
`assets/` and never reaches into the root `/assets/`. That keeps each one a
drop-in folder you can add, hand off, or delete without touching anything else.

---

## How to add a new client landing page

```bash
mkdir -p newclient/assets
# put index.html in newclient/, images+fonts in newclient/assets/
# reference them relatively: src="assets/hero.jpg"
git add newclient && git commit -m "Add Newclient landing page" && git push
```

Live at `www.neobydesign.com/newclient` within a minute or so.

Keep build sources (Shopify themes, zips, PSDs, brand docs) in
`_source/clients/newclient/` — on your disk, out of the deploy.

Not ready to publish? Build it in `_source/clients/newclient/site/` and move it
to the root when it's ready.

## How to update the portfolio

- **Edit a case study** — `work/<name>/index.html`
- **Add images to one** — `assets/work/<name>/`, reference as
  `/assets/work/<name>/file.jpg`
- **Add a new case study** — `mkdir work/<name>/`, add `index.html`, put images
  in `assets/work/<name>/`, then link it from `index.html`
- **Change something sitewide** — `shared/`

## Before pushing

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

The site must be viewed over a server, not by opening the file directly —
root-absolute paths (`/assets/...`) only resolve against a server root.

---

## Old URLs

Case studies used to live at flat paths (`/drsquatch.html`). Those files still
exist as one-line meta-refresh redirects to the new folder URLs, so previously
shared links keep working. Leave them in place; don't add new ones.
