![Grok.com Query Parameter Field Guide](docs/assets/hero.png)

# Grok.com Query Parameter Field Guide

Visual HTML documentation of a **live, authenticated** experiment on [grok.com](https://grok.com/) (2026-08-05).

Only browser-observed behavior is recorded. This is not an official xAI document.

## Open the docs

Static files need HTTP so `fetch('data/findings.json')` works:

```bash
cd /Users/velocityworks/IdeaProjects/grok-com-query-params-docs
python3 -m http.server 8765
```

Then open:

- http://127.0.0.1:8765/
- http://127.0.0.1:8765/pages/parameters.html
- http://127.0.0.1:8765/pages/recipes.html
- http://127.0.0.1:8765/pages/methodology.html

## Contents

| Path | Purpose |
|------|---------|
| `index.html` | Overview, buckets, modes table, recipe preview |
| `pages/parameters.html` | Full parameter catalog with search/filters |
| `pages/recipes.html` | Deep-link recipes + live URL builder |
| `pages/methodology.html` | Experiment protocol |
| `data/findings.json` | Machine-readable source of truth |
| `assets/css/styles.css` | Design system |
| `assets/js/app.js` | Rendering + copy + builder |

## Golden paths (observed)

```
https://grok.com/?q=URL_ENCODED_PROMPT
https://grok.com/?q=URL_ENCODED_PROMPT&mode=expert
https://grok.com/?q=URL_ENCODED_PROMPT#private
https://grok.com/?mode=fast
```

## Updating findings

Edit `data/findings.json`, then refresh the site. The UI reads that file only.

## License

Personal research notes. Use at your own risk; product behavior can change.
