// Garment photography and video, processed from copies of the original shoot files
// (4:5 crops unless noted, colour checked, GPS/EXIF stripped; see README "Media"). Each photo is listed with
// all its widths so <img srcSet> can pick one; keep these entries in step with src/assets/media.

import a1Detail240 from './assets/media/a1-detail-240.webp'
import a1Detail640 from './assets/media/a1-detail-640.webp'
import a1Detail1080 from './assets/media/a1-detail-1080.webp'
import a1Door240 from './assets/media/a1-door-240.webp'
import a1Door640 from './assets/media/a1-door-640.webp'
import a1Door1080 from './assets/media/a1-door-1080.webp'
import a1Fit240 from './assets/media/a1-fit-240.webp'
import a1Fit640 from './assets/media/a1-fit-640.webp'
import a1Fit975 from './assets/media/a1-fit-975.webp'
import a1Main240 from './assets/media/a1-main-240.webp'
import a1Main640 from './assets/media/a1-main-640.webp'
import a1Main1080 from './assets/media/a1-main-1080.webp'
import a2Cover320 from './assets/media/a2-cover-320.webp'
import a2Cover480 from './assets/media/a2-cover-480.webp'
import a2Detail240 from './assets/media/a2-detail-240.webp'
import a2Detail640 from './assets/media/a2-detail-640.webp'
import a2Detail1080 from './assets/media/a2-detail-1080.webp'
import a2Door240 from './assets/media/a2-door-240.webp'
import a2Door640 from './assets/media/a2-door-640.webp'
import a2Door1080 from './assets/media/a2-door-1080.webp'
import a2Main240 from './assets/media/a2-main-240.webp'
import a2Main640 from './assets/media/a2-main-640.webp'
import a2Main1080 from './assets/media/a2-main-1080.webp'
import b1Detail240 from './assets/media/b1-detail-240.webp'
import b1Detail640 from './assets/media/b1-detail-640.webp'
import b1Detail1080 from './assets/media/b1-detail-1080.webp'
import b1Front240 from './assets/media/b1-front-240.webp'
import b1Front640 from './assets/media/b1-front-640.webp'
import b1Front1080 from './assets/media/b1-front-1080.webp'
import b1Main240 from './assets/media/b1-main-240.webp'
import b1Main640 from './assets/media/b1-main-640.webp'
import b1Main1080 from './assets/media/b1-main-1080.webp'
import b2Cover320 from './assets/media/b2-cover-320.webp'
import b2Cover480 from './assets/media/b2-cover-480.webp'
import b2Detail240 from './assets/media/b2-detail-240.webp'
import b2Detail640 from './assets/media/b2-detail-640.webp'
import b2Detail1080 from './assets/media/b2-detail-1080.webp'
import b2Main240 from './assets/media/b2-main-240.webp'
import b2Main640 from './assets/media/b2-main-640.webp'
import b2Main1080 from './assets/media/b2-main-1080.webp'
import heroA2640 from './assets/media/hero-a2-640.webp'
import heroA21080 from './assets/media/hero-a2-1080.webp'
import a1Video from './assets/media/a1-video.mp4'
import a1VideoPoster from './assets/media/a1-video-poster.webp'
import a2Video from './assets/media/a2-video.mp4'
import a2VideoPoster from './assets/media/a2-video-poster.webp'
import b2Video from './assets/media/b2-video.mp4'
import b2VideoPoster from './assets/media/b2-video-poster.webp'

// srcSet lists every width; `sizes` on each <img> lets the browser pick the right one.
const picture = (variants, width, height) => ({
  src: variants[variants.length - 1][0],
  srcSet: variants.map(([url, w]) => `${url} ${w}w`).join(', '),
  width,
  height,
})

export const images = {
  heroA2: picture([[heroA2640, 640], [heroA21080, 1080]], 1080, 1728),
  a1Detail: picture([[a1Detail240, 240], [a1Detail640, 640], [a1Detail1080, 1080]], 1080, 1350),
  a1Door: picture([[a1Door240, 240], [a1Door640, 640], [a1Door1080, 1080]], 1080, 1350),
  a1Fit: picture([[a1Fit240, 240], [a1Fit640, 640], [a1Fit975, 975]], 975, 1219),
  a1Main: picture([[a1Main240, 240], [a1Main640, 640], [a1Main1080, 1080]], 1080, 1350),
  a2Detail: picture([[a2Detail240, 240], [a2Detail640, 640], [a2Detail1080, 1080]], 1080, 1350),
  a2Door: picture([[a2Door240, 240], [a2Door640, 640], [a2Door1080, 1080]], 1080, 1350),
  a2Main: picture([[a2Main240, 240], [a2Main640, 640], [a2Main1080, 1080]], 1080, 1350),
  b1Detail: picture([[b1Detail240, 240], [b1Detail640, 640], [b1Detail1080, 1080]], 1080, 1350),
  b1Front: picture([[b1Front240, 240], [b1Front640, 640], [b1Front1080, 1080]], 1080, 1350),
  b1Main: picture([[b1Main240, 240], [b1Main640, 640], [b1Main1080, 1080]], 1080, 1350),
  b2Detail: picture([[b2Detail240, 240], [b2Detail640, 640], [b2Detail1080, 1080]], 1080, 1350),
  b2Main: picture([[b2Main240, 240], [b2Main640, 640], [b2Main1080, 1080]], 1080, 1350),
  // Taller 2:3 crops of the A2 and B2 main shots: the one photo in each Collections row below 900 px,
  // framed so the garment and its embroidery still read at thumbnail size.
  a2Cover: picture([[a2Cover320, 320], [a2Cover480, 480]], 480, 720),
  b2Cover: picture([[b2Cover320, 320], [b2Cover480, 480]], 480, 720),
}

export const videos = {
  a1: { src: a1Video, poster: a1VideoPoster, width: 720, height: 900 },
  a2: { src: a2Video, poster: a2VideoPoster, width: 720, height: 900 },
  b2: { src: b2Video, poster: b2VideoPoster, width: 720, height: 900 },
}
