# Design System Document: Industrial Excellence & Automation

## 1. Overview & Creative North Star
The **Creative North Star** for this design system is **"The Secure Monolith."** 

This system moves away from the generic, lightweight aesthetic of modern SaaS to embrace the heavy, structural, and authoritative nature of metalwork and high-end automation. It is designed to feel as "bolted down" as a security gate yet as fluid as a smart-home interface. We achieve this through an editorial approach: high-contrast typography, deep tonal layering, and intentional asymmetry that mimics the architectural lines of modern industrial design. This system rejects the "flat web" in favor of a tactile, high-fidelity experience that communicates unwavering reliability and technical sophistication.

---

## 2. Colors: Tonal Depth & Industrial Accents
Our palette is anchored in a deep navy industrial base, punctuated by high-visibility "caution" gold and technical blues.

### The "No-Line" Rule
To maintain a premium, architectural feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section should sit directly on a `surface` background to define its territory through mass, not lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use Material-aligned surface tokens to create "nested" depth:
- **Base Layer:** `surface` (#061423) — The foundation of the experience.
- **Structural Layers:** `surface-container-low` (#0f1c2c) for secondary information blocks.
- **Active Layers:** `surface-container-highest` (#283646) for interactive cards or floating modals.

### The "Glass & Gradient" Rule
Floating elements (modals, dropdowns, navigation bars) should utilize **Glassmorphism**. Apply a semi-transparent `surface-variant` with a 12px-20px backdrop blur. This allows the primary brand colors to bleed through, softening the industrial edges.

### Signature Textures
Main CTAs and Hero sections should not use flat colors. Apply a subtle linear gradient (e.g., `primary` #ffba35 to `on-primary-container` #ad7900) at a 135-degree angle to provide a metallic "satin" finish.

---

## 3. Typography: Authority Through Contrast
The typography system uses a dual-font approach to balance technical precision with human-centric readability.

- **Display & Headlines (Space Grotesk):** A bold, futuristic sans-serif with technical quirks. Used for high-impact messaging. It conveys the "Automation" and "Security" side of the business. Use `display-lg` (3.5rem) for hero statements to demand attention.
- **Titles & Body (Manrope):** A clean, geometric sans-serif that ensures absolute clarity. Manrope provides a professional, "Blue-Collar Premium" feel.
- **Visual Scale:** Maintain a dramatic scale difference between `headline-lg` and `body-md`. High contrast in size communicates confidence and high-end editorial intent.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "atmosphere."

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that mimics heavy materials stacked in a workshop.
- **Ambient Shadows:** For floating components like the "Solicitar Orçamento" button, use extra-diffused shadows.
    - *Shadow Token:* `0px 12px 32px rgba(0, 0, 0, 0.4)`. The shadow should be a dark tint of the background, never pure black.
- **The "Ghost Border" Fallback:** If a container needs more definition (e.g., on a complex image background), use a **Ghost Border**. This is the `outline-variant` (#44474c) at 15% opacity. Never use 100% opaque borders.
- **Industrial Precision:** Use `roundedness-sm` (0.125rem) or `roundedness-md` (0.375rem) for most structural elements. Save `roundedness-full` specifically for buttons to create a "tactile switch" feel.

---

## 5. Components: Engineered Elements

### Buttons
- **Primary:** Gradient fill (`primary` to `on-primary-container`), bold `label-md` in `on-primary` (#422c00), and `roundedness-full`.
- **Secondary (The Automation Style):** A "Ghost Border" using `primary` at 40% opacity with a `primary` text label. 
- **States:** Hovering over a button should trigger a subtle `surface-bright` inner glow, mimicking an illuminated electronic switch.

### Cards & Service Blocks
- **Constraint:** Forbid the use of divider lines.
- **Implementation:** Use `surface-container` tiers and `spacing-8` (2rem) of vertical white space to separate service offerings. Each card should feel like a solid block of material.

### Input Fields
- **Background:** `surface-container-lowest` (#020f1e).
- **Active State:** Instead of a full border highlight, use a 2px bottom-bar in `primary` (#ffba35). This feels more like a technical instrument or a digital blueprint.

### Specialized Components
- **Security Status Badges:** Use `surface-container-highest` with a small `primary` dot to indicate "System Active" or "Service Available."
- **Technical Specs Chips:** Small, `roundedness-none` chips using `secondary-container` backgrounds for a rugged, industrial look.

---

## 6. Do's and Don'ts

### Do
- **Do** use large, high-quality photography of metal textures and electronic hardware as backgrounds, darkened by a `surface` color overlay.
- **Do** utilize the `spacing-20` (5rem) and `spacing-24` (6rem) tokens for section margins to give the content "room to breathe"—luxury is defined by space.
- **Do** align icons and text to a strict grid to mimic engineering schematics.

### Don't
- **Don't** use generic icons. Use thick-stroke, technical icons that look like architectural symbols.
- **Don't** use pure white (#ffffff) for large bodies of text. Use `on-surface-variant` (#c4c6cc) to reduce eye strain and maintain the "dark mode" premium feel.
- **Don't** use standard "Material Design" shadows. They are too soft for an industrial brand; stick to tonal shifts and high-diffusion ambient glows.
- **Don't** use bright, saturated colors outside of the `primary` (yellow/gold) accent. The navy must remain the dominant soul of the UI.