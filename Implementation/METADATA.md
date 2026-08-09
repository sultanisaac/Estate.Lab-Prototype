# Implementation Plan: Website Metadata & Social Media Previews

## Objective
Replace the default preview with a custom, high-quality snapshot of the Estate.Lab website and implement a comprehensive metadata strategy for SEO and social media sharing (Open Graph & Twitter Cards).

## 1. Asset Generation (Website Snapshot)
- **Task**: Create a professional snapshot/preview image of the website.
- **Action**: I can use my image generation capabilities to create a high-quality `og-image.jpg` (1200x630 pixels, standard for social media previews) that reflects the premium real estate aesthetic of the Estate.Lab prototype. Alternatively, you can provide an actual screenshot of the built website.
- **Location**: The image will be saved to `public/og-image.jpg`.

## 2. Standard SEO Metadata Update
- **Target File**: `index.html`
- **Action**: Add standard SEO tags to the `<head>` section to improve search engine visibility:
  - `<meta name="title" content="Estate.Lab | Premium Real Estate" />`
  - `<meta name="description" content="Discover premium real estate properties with Estate.Lab. Your ultimate destination for luxury homes, modern architecture, and exclusive listings." />`
  - `<meta name="keywords" content="Real Estate, Premium Properties, Luxury Homes, Estate.Lab, Property Listings" />`
  - `<meta name="author" content="Estate.Lab" />`
  - `<meta name="language" content="English" />`

## 3. Social Media Metadata (Open Graph & Twitter)
- **Target File**: `index.html`
- **Action**: Add comprehensive Open Graph (OG) and Twitter Card tags to ensure rich, beautiful previews when links are shared on platforms like Facebook, LinkedIn, Twitter, Slack, WhatsApp, and iMessage.

### Open Graph (Facebook, LinkedIn, iMessage, WhatsApp)
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://estate-lab.vercel.app/" /> <!-- Placeholder domain -->
<meta property="og:title" content="Estate.Lab | Premium Real Estate" />
<meta property="og:description" content="Discover premium real estate properties with Estate.Lab. Your ultimate destination for luxury homes, modern architecture, and exclusive listings." />
<meta property="og:image" content="https://estate-lab.vercel.app/og-image.jpg" />
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://estate-lab.vercel.app/" />
<meta name="twitter:title" content="Estate.Lab | Premium Real Estate" />
<meta name="twitter:description" content="Discover premium real estate properties with Estate.Lab. Your ultimate destination for luxury homes, modern architecture, and exclusive listings." />
<meta name="twitter:image" content="https://estate-lab.vercel.app/og-image.jpg" />
```

## 4. Mobile & Theme Enhancements
- **Target File**: `index.html`
- **Action**: Ensure the browser and mobile experience feels native and branded.
  - `<meta name="theme-color" content="#0a0a0a" />` (Will match the primary background color of the app)
  - `<meta name="color-scheme" content="dark light" />`

## Execution Steps
Once approved, I will:
1. Generate the premium preview image (`og-image.jpg`) using AI and save it to the `public/` folder.
2. Edit `index.html` to inject all the above meta tags carefully into the `<head>` section.
3. Help verify if any additional changes are needed based on your specific Vercel deployment URL (if you have one ready).

Let me know if you are happy with this plan, or if you'd like to adjust the description texts before we begin coding!
