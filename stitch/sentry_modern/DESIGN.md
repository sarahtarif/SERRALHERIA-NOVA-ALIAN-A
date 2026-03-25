# Design System Specification: Editorial Security & Automation

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Guardian"**

This design system moves away from the utilitarian, "construction-site" aesthetic common in gate automation and elevates the industry to a premium, high-security editorial experience. We transition from a generic service provider look to a sophisticated technology partner. 

The system utilizes **Intentional Asymmetry** and **Tonal Depth** to create a sense of fortified elegance. By breaking away from rigid, boxed-in layouts and embracing breathing room (`spacing-24`), we convey the confidence of a market leader in São Paulo. The interface is not just a tool; it is a digital representation of safety, precision, and architectural integration.

---

## 2. Colors
Our palette is a refined evolution of the traditional dark blue and yellow. It leverages deep "midnight" foundations to create an environment where information "glows" with importance.

*   **Primary (`#a9c7ff`):** A soft, luminous blue for core brand interaction. Use this for high-priority UI signals.
*   **Secondary/Accent (`#fabd00` / `#ffdf9e`):** Our legacy yellow, modernized into a "Gold Standard." Use it sparingly for critical focus points and trust-based indicators (e.g., "+15 years").
*   **Surface Hierarchy:** 
    *   **The "No-Line" Rule:** Explicitly prohibit 1px solid borders for sectioning. Define boundaries through color shifts. A section using `surface_container_low` should sit directly against a `surface` background to define its area.
    *   **Surface Nesting:** Use `surface_container_lowest` for deep "recessed" elements and `surface_container_highest` for "protruding" elements. This creates a tactile, mechanical feel reminiscent of high-end hardware.
*   **The Glass & Gradient Rule:** Utilize Glassmorphism for floating navigation and overlay cards. Apply a `surface` color with 60-80% opacity and a 20px-32px backdrop blur. For CTAs, use a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to add "soul" and dimension.

---

## 3. Typography
We use a high-contrast typographic pairing to balance technical precision with human readability.

*   **Display & Headlines (Space Grotesk):** A geometric sans-serif with eccentric, "tech-forward" details. 
    *   **Role:** Conveys authority and innovation. 
    *   **Styling:** Use `display-lg` for hero statements. Apply negative letter-spacing (-0.02em) to large headlines to create a tighter, editorial feel.
*   **Titles & Body (Manrope):** A modern, functional typeface designed for legibility at all scales.
    *   **Role:** Guides the user through complex service details.
    *   **Styling:** Maintain generous line-height (1.6) for `body-lg` to ensure high readability in technical descriptions.
*   **Labels (Inter):** A utilitarian workhorse for micro-copy.
    *   **Role:** Status indicators, navigation, and technical specs.

---

## 4. Elevation & Depth
In this system, depth is a functional tool for security, not just decoration.

*   **Tonal Layering:** Avoid shadows for static content. Stack `surface-container-low` cards on top of `surface-dim` backgrounds.
*   **Ambient Shadows:** For floating elements (like the "Solicitar Orçamento" button or mobile menus), use an ultra-diffused shadow: `offset: 0 12px`, `blur: 32px`, `color: rgba(0, 27, 61, 0.4)`. This mimics natural light reflecting off technical equipment.
*   **The Ghost Border:** If a boundary is required for accessibility, use `outline_variant` at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** For the header and feature cards, use `surface_variant` with a 70% opacity and a heavy backdrop blur to create a "frosted glass" effect that lets the brand imagery bleed through softly.

---

## 5. Components

### Buttons
*   **Primary:** High-gloss gradient from `primary` to `primary_container`. Text color `on_primary`. Shape: `rounded-md` (0.375rem).
*   **Secondary:** Ghost-style. `outline_variant` (at 20% opacity) with `primary` text.
*   **States:** On hover, increase the surface elevation by shifting from `surface_container` to `surface_bright`.

### Cards & Lists
*   **Editorial Layout:** Cards must never use dividers. Use `spacing-6` (2rem) of vertical white space to separate content. 
*   **Refinement:** Service cards should use a `surface_container_low` background with a `rounded-xl` corner. 

### Inputs & Fields
*   **Focus State:** Instead of a heavy border, use a 2px "inner glow" using the `primary` color at 40% opacity.
*   **Background:** Use `surface_container_highest` to ensure fields are clearly interactable against the dark background.

### Security Chips
*   Used for status (e.g., "Active Monitoring"). Use `secondary_container` background with `on_secondary_container` text. Use `rounded-full` for a modern, pill-shaped look.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use the `secondary` (yellow) only as a strategic highlight. It is a "surgical" color, not a background color.
*   **Do** embrace negative space. Let the `display-lg` typography breathe.
*   **Do** use `spacing-16` or `spacing-20` for section margins to maintain an expensive, editorial feel.
*   **Do** use large, high-quality architectural or hardware photography as the base layer, obscured by `surface` overlays.

### Don't:
*   **Don't** use 100% opaque, high-contrast borders (e.g., white or bright yellow lines).
*   **Don't** use standard "drop shadows" with pure black or grey. Always tint shadows with the `on_surface` color.
*   **Don't** crowd the layout. If three items are on a row, ensure they have at least `spacing-8` of gutter.
*   **Don't** use dividers. If you feel the need to separate two pieces of content, use a background color shift or increase the spacing.