# ASK IKUGO — static example library

This branch replaces the former conversation integration. It uses only HTML, CSS and JavaScript. The 66 NOVA examples are prepared editorial content, not live agent transcripts. No setup, environment variables, API keys, account, database or server is needed to browse them.

## Local preview

Open `index.html` in a browser and go to ASK IKUGO, or scroll to section 05. All scripts, styles and images are local. The supplied ZIP must be extracted with its folder structure intact. Do not open only the HTML from inside the ZIP.

## Content and controls

Currency edition (13 October 2026): every displayed amount is in USD. These are fictional example values, not converted real balances. Sales and overdue summaries show a single USD total; period comparisons and invoice references remain consistent.

- `ask-ikugo-scenarios.js`: English content for NOVA-01–NOVA-66, seven categories, exact counts 10/10/14/8/8/10/6. Based on the previously reviewed scenario catalog.
- `ask-ikugo.js`: category filters, token-based local search, six items per list page, previous/next selection, eight result layouts and related examples.
- Ten approval examples show preparation, then an explicit illustrated human decision, then the result. The buttons only reveal text. Ten direct-write examples do not add a separate approval. Read and analysis examples are 23 each.
- Each selection is an independent illustrative case. Changing examples resets the displayed stage. No persistent storage or cumulative business state.
- `ask-ikugo.css`: scoped typography, responsive layouts, visible keyboard focus and reduced-motion support.
- `index.html`: section 05 replaced, static-library FAQ corrected. Existing navigation and SEO retained.
- `styles.css`: obsolete ASK styles removed; other styles retained.
- `netlify.toml` and HTML meta: `connect-src 'none'`, `form-action 'none'`, `object-src 'none'`, `base-uri 'self'`. These deny script API connections and form submissions in the preview and future static hosting.

The old API configuration, form, session handling, retry code, model response rendering and backend-dependent capture script have been removed. The page contains no external resources or internal application links. Carrier and email operations appear only as documented fictional examples; they make no requests.

## Verification

Development-only DOM suite: Node.js plus jsdom 26, then `node --test tests/ask-ikugo.dom.cjs`.

Optional real browser checks: Node.js plus Playwright and its Chromium browser, then `node tests/ask-ikugo.browser.cjs`. Set `BROWSER_CHANNEL=msedge` to use installed Edge. The script creates a loopback-only static server, checks 1440/768/390 px, exercises every example, captures screenshots and writes a JSON report to `.browser-results`. These are test tools, not site dependencies. It closes its server/browser when finished.

DOM checks validate behavior but cannot prove rendered layout. Use the browser report, if successfully generated, for that evidence.

In the extracted preview ZIP, tests are kept outside the public site folder. Set `IKUGO_SITE_ROOT` to the absolute path of `ikugo-static-preview`, then run `node --test dev-tests/tests/ask-ikugo.dom.cjs` or `node dev-tests/tests/ask-ikugo.browser.cjs`. Development dependencies must be installed separately; normal browsing needs none. `IKUGO_SITE_ROOT` is only a test-runner setting, not a site environment variable.

## Publication boundary

No push, merge or deployment is part of this change. Review locally first. After explicit approval, the static site files can replace the existing marketing build on Netlify. No backend integration is required. The original backend repository is unchanged by this work. Public API/model usage cost for this library is zero; existing static hosting terms still apply.
