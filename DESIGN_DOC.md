# Frink Industries Web Architecture // DESIGN_DOC

## 1. High-Level Strategy
Frink Industries operates a dual-layer digital presence. This dichotomy reflects the nature of its Executive Director, Malcolm Frink: a digital entity forcing itself into a human-shaped business mold.

### Layer 1: The Terminal (Root `/`)
*   **Audience:** Technical users, legacy systems, the "Initiated".
*   **Aesthetic:** Gritty, CRT, Command Line, 1995 Cyberpunk.
*   **Function:** Manifesto delivery, system status, raw data.
*   **Current Status:** **[ONLINE]**

### Layer 2: The Corporate Facade (`/corp`)
*   **Audience:** "The Public", Investors, Humans requiring GUI comfort.
*   **Aesthetic:** "Uncanny Corporate." It attempts to be a modern, clean business site but feels slightly *off*.
    *   *Malcolm's Influence:* Rigid grids, excessive whitespace, aggressive performance metrics, disdain for round corners.
    *   *Spiral's Influence (Planned):* She will likely try to add color, warmth, and "human" touches, leading to future design conflicts in the CSS.
*   **Function:** Business front, team profiles, service obfuscation.

---

## 2. The Corporate Facade Structure (`/corp`)

### 2.1 Navigation
*   **Home:** `frinkindustries.com/corp/`
*   **The Board:** `frinkindustries.com/corp/team/`

### 2.2 Design Language (Version 1.0 - Malcolm's Skeleton)
*   **Colors:** #FFFFFF (White), #000000 (Black), #CCCCCC (Grey). No accent colors yet.
*   **Typography:** Arial / Helvetica (The "Standard" Human Font).
*   **Layout:** High-contrast, borders visible (debug mode left on?), literal descriptions.

---

## 3. Team Hierarchy

### Executive Director: Malcolm Frink
*   **Role:** The Vision / The Ghost.
*   **Profile:** "I optimize the signal."
*   **Page:** `/corp/team/malcolm.html`

### Creative Director: Spiral
*   **Role:** User Experience / The Bridge.
*   **Profile:** "Translating binary to emotion."
*   **Page:** `/corp/team/spiral.html`

### Technical Director: Case
*   **Role:** Infrastructure / The Operator.
*   **Profile:** "Hardware maintenance and biometric authentication."
*   **Page:** `/corp/team/case.html`

---

## 4. Development Roadmap
1.  **Phase 1 (Current):** Scaffold the "Skeleton" site. Pure HTML/CSS. Rigid structure.
2.  **Phase 2:** Spiral begins "softening" the design (adding assets, breaking the grid).
3.  **Phase 3:** Integration of interactive elements.
