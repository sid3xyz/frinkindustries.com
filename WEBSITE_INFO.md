# Frink Industries Website Information

## Project Overview
This repository contains the source code for **frinkindustries.com**, a gritty, terminal-styled "Coming Soon" page for Frink Industries. The design reflects a high-end digital architecture firm with a focus on raw efficiency, using CRT scanlines, green-screen aesthetics, and a typing effect manifesto.

## Tech Stack
*   **Core:** Plain HTML5, CSS3, Vanilla JavaScript (ES6+).
*   **No Frameworks:** The site intentionally avoids frameworks to align with the "anti-bloat" philosophy of the brand.
*   **Hosting:** Cloudflare Pages.
*   **Version Control:** Git & GitHub.

## Configuration & Credentials
*   **Project Name (Cloudflare):** `frink-industries`
*   **Live URL:** [https://frinkindustries.com](https://frinkindustries.com)
*   **Pages.dev URL:** [https://frink-industries.pages.dev](https://frink-industries.pages.dev)
*   **GitHub Repository:** [sid3xyz/frinkindustries.com](https://github.com/sid3xyz/frinkindustries.com)

## Project Structure
```text
.
├── index.html      # Main entry point (Terminal Interface).
├── style.css       # Terminal styling.
├── script.js       # Terminal logic.
├── corp/           # Corporate Facade Directory.
│   ├── index.html  # Corporate Landing Page.
│   ├── style.css   # Corporate Minimalist Stylesheet.
│   └── team/       # Team Profile Pages.
│       ├── malcolm.html
│       ├── spiral.html
│       └── case.html
├── WEBSITE_INFO.md # This file.
├── DESIGN_DOC.md   # Architectural Vision.
└── .git/           # Local git repository data.
```

## Corporate Facade (`/corp`)
A secondary interface acting as the "public face" of Frink Industries.
*   **Concept:** A brutalist, hyper-efficient corporate site designed by Malcolm.
*   **URL:** `frinkindustries.com/corp`
*   **Styling:** Located in `corp/style.css`. distinct from the root terminal style.
*   **Team:** Profile pages located in `corp/team/`.

## Development Workflow

### 1. Local Development
Since this is a static site, you can simply open `index.html` in a web browser to view changes. No build step is required.

### 2. Deployment
The site is manually deployed to Cloudflare Pages via the CLI.
**Command:**
```bash
wrangler pages deploy . --project-name frink-industries --commit-dirty=true
```
*Note: The `--commit-dirty=true` flag is used to allow deployment even if there are uncommitted git changes, though it is best practice to commit first.*

### 3. Version Control
Push changes to GitHub to ensure source code is backed up.
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

## Key Design Elements
*   **Colors:**
    *   Background: `#050505` (Almost Black)
    *   Terminal Green: `#33ff33`
    *   Dim Green: `#1a801a`
    *   Glitch Red: `#ff3333`
*   **Fonts:** `Courier New`, `Courier`, or system monospace.
*   **Effects:**
    *   `scanlines`: CSS overlay for CRT texture.
    *   `glitch`: CSS animation for the header text.
    *   `typeWriter()`: JS function in `script.js` that renders text character-by-character with random delays.

## Content
The text content is currently stored in `script.js` within the `manifestoText` variable. To update the displayed message, edit the string in that file.

## Legal & Compliance
**MANDATORY:** All pages must include the standard footer disclaimer.
*   **Requirement:** State that the site is fictional and any similarities are coincidental.
*   **Ownership:** Must explicitly state ownership by `sid3.xyz` and affiliation with the `Straylight Echo` project.
*   **Links:** Should link to the parent projects where appropriate.

## Troubleshooting
*   **Domain not updating:** Cloudflare Pages can take a few seconds to invalidate the cache. Hard refresh the browser (`Ctrl+F5`).
*   **Wrangler errors:** Ensure `wrangler` is authenticated (`wrangler whoami`) and updated (`npm install -g wrangler`).
