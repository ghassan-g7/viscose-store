import { images, videos } from './media'

export const standardSizes = ['50', '52', '54', '56', '57']

// Product fields:
// price in OMR.
// shayla: { price, detail?, size? }: an optional shayla for `price` OMR. With `detail` ('color' or
//   'fabric'; labels in copy.*.shaylaDetails) the customer can describe it once it is selected;
//   `size` names a fixed shayla size (labels in copy.*.shaylaSizes). The two can be combined (A2).
// colorOnRequest: show the "color can be changed on request" note under the garment color.
// gallery: real photos of the garment; the first is the main photo used on cards and in the order.
//   `view` picks each photo's alt text from copy.*.galleryAlt.
// video: offered in the product details, loaded only when requested and played silently on a
//   loop without browser controls (the files have no audio track).
export const products = [
  {
    code: 'A1',
    category: 'occasion',
    price: 36,
    shayla: { price: 2, detail: 'color' },
    gallery: [
      { view: 'main', image: images.a1Main },
      { view: 'fit', image: images.a1Fit },
      { view: 'detail', image: images.a1Detail },
    ],
    video: videos.a1,
  },
  {
    code: 'A2',
    category: 'occasion',
    price: 48,
    shayla: { price: 3, size: 'liso', detail: 'color' },
    colorOnRequest: true,
    gallery: [
      { view: 'main', image: images.a2Main },
      { view: 'detail', image: images.a2Detail },
      { view: 'full', image: images.a2Door },
    ],
    video: videos.a2,
  },
  {
    code: 'B1',
    category: 'occasion',
    price: 43,
    shayla: { price: 2, detail: 'fabric' },
    gallery: [
      { view: 'main', image: images.b1Main },
      { view: 'front', image: images.b1Front },
      { view: 'detail', image: images.b1Detail },
    ],
  },
  {
    code: 'B2',
    category: 'everyday',
    price: 32,
    shayla: { price: 2, detail: 'color' },
    colorOnRequest: true,
    gallery: [
      { view: 'main', image: images.b2Main },
      { view: 'detail', image: images.b2Detail },
    ],
    video: videos.b2,
  },
]

export const productByCode = (code) => products.find((product) => product.code === code)

export const galleryIndex = (product, view) => Math.max(0, product.gallery.findIndex((item) => item.view === view))
