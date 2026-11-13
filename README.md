# Viscose Design

Front-end storefront for **Viscose Design**, focused on occasion and everyday mukhawars.

## Current scope

- Arabic / English interface, mirrored layouts for right-to-left and left-to-right
- Real garment photography and short product videos; the brand's plum, gold, ivory, cream and sand palette for everything else
- Occasion collection: A1 (36 OMR), A2 (48 OMR), B1 (43 OMR)
- Everyday collection: B2 (32 OMR)
- Sizes: 50, 52, 54, 56, 57 + custom size
- Customer-entered preferred color, with optional shayla per product
- Product details with a photo gallery; A1, A2 and B2 also have a video that plays silently on a loop after "Watch video"
- Order bag that sends the complete order to WhatsApp
- Instagram link
- Responsive layout for desktop and mobile

## Run locally

```bash
npm install
npm run dev
```

The Content Security Policy in `index.html` blocks the inline styles Vite injects in development, so
check layout with a production build:

```bash
npm run build
npm run preview
```

## Media

Product media lives in `src/assets/media/` and is listed in `src/media.js`; `src/products.js` assigns
it to each product. All files were made from copies of the original shoot files:

- Photos: 4:5 crops, colour checked against neutral surfaces in each scene, Display P3 colour kept,
  WebP at 240, 640 and 1080 px wide (served through `srcset`), with EXIF and GPS removed.
- Videos: H.264, 720 × 900, 30 fps, no audio track, fast-start MP4; poster is the clip's first frame.

| Product | Main photo | Other photos | Video |
|---|---|---|---|
| A1 | IMG_2710 (seated) | IMG_2714 (full length), IMG_2710 (bodice and cuffs close-up) | IMG_2703 (0–5.3 s) |
| A2 | IMG_2724 frame at 1.35 s (replaces the A2.PNG screenshot) | IMG_2726 (yoke close-up), IMG_2722 frame at 0.5 s (full length) | IMG_2724 (1–11 s) |
| B1 | B1.HEIC (seated) | IMG_2668 (front), IMG_2668 (rope-cord yoke close-up) | — |
| B2 | B2.HEIC (at the door) | IMG_2778 (panel, cuffs and lace) | IMG_2784 (0–4.45 s) |

Editorial photos: the home hero is IMG_2776 (`hero-b2`, B2 mid-step at a wooden door, cropped from the
shayla to the hem so the embroidered panel and the A-line silhouette both read), and the About page uses
IMG_2666 (`a1-door`).

The site is intentionally front-end only. Orders are passed to WhatsApp rather than stored in a backend database.
