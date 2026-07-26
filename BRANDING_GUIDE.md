# Estate.Lab Email Branding Guide

This guide provides the exact style references and best practices required to create HTML emails that maintain Estate.Lab's premium, high-end identity. 

Because HTML emails require broad support across various email clients (Outlook, Gmail, Apple Mail), we must use inline CSS and web-safe fallbacks.

---

## 1. Brand Colors

Use these exact hex codes for all email communications.

| Color | Hex Code | Usage in Email |
| :--- | :--- | :--- |
| **Deep Emerald Teal** | `#0F4C5C` | Primary brand color. Use for headers, footer backgrounds, primary buttons, and major headings (`<h1>`, `<h2>`). |
| **Champagne Gold** | `#D4B483` | Secondary accent color. Use for secondary buttons, text highlights, dividers (`<hr>`), and icons. |
| **Warm Ivory** | `#FAF8F4` | Main email body background. Provides a premium, warm feel compared to stark white. |
| **Blush Sand** | `#E8DCCB` | Subtle accent color. Use for soft borders, table cell backgrounds, or subtle dividers. |
| **Graphite** | `#1F2937` | Primary text color. Use for all body copy and standard text. Never use pure black (`#000000`). |
| **Pure White** | `#FFFFFF` | Use for content cards/containers placed over the Warm Ivory background to create depth. |

---

## 2. Typography

Estate.Lab relies on a Serif/Sans-Serif pairing. Since custom web fonts (like Google Fonts) are often blocked by email clients (especially Outlook), you **must** provide web-safe fallback stacks.

### Headings (Serif)
- **Font-Family Stack:** `'Playfair Display', Georgia, 'Times New Roman', serif`
- **Color:** `#0F4C5C` (Deep Emerald Teal)
- **Weight:** Bold (700)
- **Usage:** Email titles, section headers, property names.

### Body Text (Sans-Serif)
- **Font-Family Stack:** `'Inter', Arial, Helvetica, sans-serif`
- **Color:** `#1F2937` (Graphite)
- **Weight:** Normal (400)
- **Size:** 16px (minimum 14px for fine print)
- **Line-Height:** 1.6 (160%)
- **Usage:** Paragraphs, descriptions, footer text.

---

## 3. Structural Guidelines

### Container
- **Width:** Maximum `600px`.
- **Background:** `#FAF8F4` (Warm Ivory) for the outer wrapper, `#FFFFFF` (Pure White) for the inner content container.
- **Alignment:** Center-aligned.

### Buttons (CTAs)
HTML email buttons should be built using table-based bulletproof buttons to ensure they render correctly in Outlook.

**Primary Button Example:**
- **Background:** `#0F4C5C`
- **Text Color:** `#FFFFFF`
- **Border-Radius:** `4px`
- **Padding:** `12px 24px`
- **Font:** Sans-serif, bold, 14px, all-caps or title case.

**Secondary Button Example:**
- **Background:** `#D4B483`
- **Text Color:** `#0F4C5C`
- **Border-Radius:** `4px`
- **Padding:** `12px 24px`

### Dividers
Use subtle, thin lines to separate content instead of heavy blocks.
- **Style:** `solid 1px #E8DCCB` (Blush Sand)

---

## 4. Imagery & Assets

- **Logo:** Always use the high-resolution logo (`logo.png`) hosted on your server/CDN. Ensure it has an `alt="Estate.Lab"` tag.
- **Property Images:** Must be high-quality and compressed. Use `width="100%"` and `style="display: block; max-width: 100%; height: auto;"` to ensure responsiveness.
- **Border-Radius on Images:** Avoid rounded corners on images in emails if possible, as Outlook Desktop does not support `border-radius`. Keep imagery sharp and rectangular for a modern, architectural feel.

---

## 5. CSS & Coding Best Practices

1. **Inline Everything:** Use a CSS inliner tool before sending. All critical styles must be inline (`<div style="...">`).
2. **Tables are King:** Use `<table>`, `<tr>`, and `<td>` for layouts. `<div>` grids and flexbox are largely unsupported in older email clients.
3. **Padding over Margins:** Use padding on `<td>` elements rather than margins, as margins are notoriously buggy in email clients.
4. **Dark Mode:** Add meta tags to support dark mode, but ensure text remains legible if colors invert. Use transparent PNGs for logos so they don't get trapped in a white box on dark themes.
