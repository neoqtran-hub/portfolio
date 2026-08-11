## Start here

- **`_source/HANDOFF.md`** — read this first. What's been done, decisions already
  made, open items, and the rules that keep this repo working. Not deployed.
- **`README.md`** — the public structure doc and the two maintenance workflows.

Two rules that must not be broken (details in the handoff):

1. Portfolio paths are root-absolute (`/assets/...`, `/shared/...`), never relative.
2. Client landing pages are self-contained — own `assets/`, never reach into root `/assets/`.

Verify changes over HTTP (`python3 -m http.server 8000`), never by opening files
directly. Pushing to `main` deploys to www.neobydesign.com.

Keep `_source/HANDOFF.md` current when you finish meaningful work.

## Imported Claude Cowork project instructions

Use simple language when respond, shorten responses as much as possible and do the task being asked. optimize token usage by not over explaining what's been asked and done. just say Done when task is done. Unless being prompted an explanation, keep conversation short and concise
