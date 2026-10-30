# HealthPlus homepage assets

Drop files at these exact paths — they appear automatically. Until a file
exists, the page shows a neutral placeholder in its place. Paths are defined in
`src/data/home.js` if you need to rename anything.

| Path | Used in | Recommended |
| --- | --- | --- |
| `hero/hero-loop.mp4` | Hero background video | 1920×1080+, H.264, muted loop, 8–15 s, < 8 MB |
| `hero/hero-poster.jpg` | First frame / fallback for the video | 1920×1080 JPG |
| `hero/hero-product.png` | Product visual on the right of the hero | Transparent PNG/WebP, ~900×1100, product centred |
| `products/panadol-extra.png` | Product card | Transparent or light-grey (#f4f6f5) background, square-ish, ~800×700 |
| `products/vitamin-d3.png` | Product card | 〃 |
| `products/cetaphil-cleanser.png` | Product card | 〃 |
| `products/accu-chek.png` | Product card | 〃 |
| `products/omega-3.png` | Product card | 〃 |
| `products/multivitamin-men.png` | Product card | 〃 |
| `banners/skincare.jpg` | "Glow Naturally" banner (dark) | ~1200×560, subject on the right half |
| `banners/family-care.jpg` | "Complete Care" banner slide 1 (light) | ~1200×560, subject on the right half |
| `banners/baby-care.jpg` | "Gentle Care" banner slide 2 (light) | ~1200×560, subject on the right half |

Notes
- Hero video is darkened on the left for headline legibility; keep the brightest
  part of the shot right of centre.
- Banner images fill the right ~65% and fade into the panel colour on the left.
- Category icons and payment marks are drawn in code (`src/components/ui/Icons.js`,
  `src/components/home/SiteFooter.js`); swap in official payment logos there if required.
