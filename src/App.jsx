import { useEffect, useMemo, useState } from 'react'
import LOGO_DATA_URL from './logoData'
import a1Photo from './assets/products/a1.webp'
import a2Photo from './assets/products/a2.webp'
import a2Video from './assets/products/a2.mp4'
import b1Photo from './assets/products/b1.webp'
import b2Photo from './assets/products/b2.webp'
import { whatsAppOrderUrl } from './whatsapp'

const WHATSAPP_NUMBER = '96892708027'
const INSTAGRAM_URL = 'https://www.instagram.com/viscose_design'
const LOGO_URL = LOGO_DATA_URL
const standardSizes = ['50', '52', '54', '56', '57']

// Optional per-product fields (A1, A2, B1 and B2 use them so far):
// photo: { src, width, height, position? }; position is a CSS object-position focal point
//   (default '50% 10%' in product-details.css).
// video: { src, width, height }: offered in the product details, loaded only when requested.
// price in OMR;
// shayla: { price, detail?, size? }: an optional shayla for `price` OMR. With `detail` ('color' or
//   'fabric'; labels in copy.*.shaylaDetails) the customer can describe it once it is selected;
//   `size` names a fixed shayla size (labels in copy.*.shaylaSizes) and asks for nothing more.
// colorOnRequest: show the "color can be changed on request" note under the garment color.
// Products with a shayla option store blank choices as '' and label them in the current language
// when shown, so identical choices group into one line across a language switch.
const products = [
  {
    code: 'A1',
    category: 'occasion',
    tone: 'plum',
    photo: { src: a1Photo, width: 900, height: 1598 },
    price: 36,
    shayla: { price: 2, detail: 'color' },
  },
  {
    code: 'A2',
    category: 'occasion',
    tone: 'gold',
    // The floral yoke sits lower in this photo, so focus lower to keep it in short crops.
    photo: { src: a2Photo, width: 900, height: 1587, position: '50% 30%' },
    video: { src: a2Video, width: 720, height: 1280 },
    price: 48,
    shayla: { price: 3, size: 'liso' },
    colorOnRequest: true,
  },
  {
    code: 'B1',
    category: 'occasion',
    tone: 'sand',
    photo: { src: b1Photo, width: 900, height: 1200 },
    price: 43,
    shayla: { price: 2, detail: 'fabric' },
  },
  {
    code: 'B2',
    category: 'everyday',
    tone: 'ivory',
    photo: { src: b2Photo, width: 900, height: 1145 },
    price: 32,
    shayla: { price: 2, detail: 'color' },
    colorOnRequest: true,
  },
]

const formatPrice = (amount) => `${amount} OMR`
const toArabicDigits = (value) => String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[digit])
const shaylaSizeLabel = (labels, sizeKey) => (sizeKey ? labels.shaylaSizes[sizeKey] : null)

function unitPriceFor(product, withShayla) {
  if (product.price == null) return null
  return product.price + (withShayla && product.shayla ? product.shayla.price : 0)
}

const routes = ['home', 'new', 'collections', 'about', 'fabrics', 'contact']

const copy = {
  ar: {
    nav: ['الرئيسية', 'الجديد', 'المجموعات', 'عن فسكوز', 'الأقمشة', 'تواصل'],
    announcement: 'طلبات مخصصة بالألوان والمقاسات',
    heroEyebrow: 'أكثر من مجرد قماش',
    heroTitle: 'الجودة تبدأ من أدق التفاصيل.',
    heroText: 'في فسكوز نصنع مخاوير مطوّرة بأقمشة مختارة بعناية، تجمع بين الأصالة والأناقة والإتقان.',
    explore: 'اكتشفي المجموعة',
    aboutCta: 'عن فسكوز',
    newEyebrow: 'وصل حديثًا',
    newTitle: 'أحدث التصاميم',
    newText: 'أربع تصاميم أولية، وصور المنتجات والأسعار ستُضاف عند تجهيزها.',
    priceSoon: 'السعر يُضاف قريبًا',
    occasion: 'مناسبات',
    everyday: 'يومي',
    collectionsEyebrow: 'اختاري أسلوبك',
    collectionsTitle: 'المجموعات',
    occasionTitle: 'مخاوير المناسبات',
    occasionText: 'A1 · A2 · B1 — تفاصيل أغنى وحضور أنيق للحظات الخاصة.',
    everydayTitle: 'المخاوير اليومية',
    everydayText: 'B2 — أناقة خفيفة ومريحة تناسب تفاصيل يومك.',
    viewCollection: 'عرض المجموعة',
    aboutEyebrow: 'قصة فسكوز',
    aboutTitle: 'أناقة هادئة، وهوية تُرى في التفاصيل.',
    aboutText: 'في فسكوز نؤمن بأن الجودة تبدأ من أدق التفاصيل. نصنع مخاوير مطوّرة بأقمشة مختارة بعناية، تجمع بين الأصالة والأناقة والإتقان؛ لنقدم لك قطعًا تليق بذوقك.',
    fabricEyebrow: 'ملمس وهوية',
    fabricTitle: 'أقمشة مختارة بعناية.',
    fabricText: 'القماش ليس خلفية للتصميم؛ هو جزء من الشخصية. لذلك نحافظ على إحساس هادئ وفاخر في اللون والملمس والتفاصيل.',
    fabricCards: [
      ['اختيار دقيق', 'خامات مختارة لتوازن الراحة مع المظهر الراقي.'],
      ['تفاصيل محسوبة', 'نهتم باللمسات الصغيرة التي تصنع الفرق عند ارتداء القطعة.'],
      ['لونك أنتِ', 'الألوان قابلة للتغيير حسب الطلب لتناسب ذوقك.'],
    ],
    whyEyebrow: 'لماذا فسكوز؟',
    whyTitle: 'مصمم ليتكيّف مع ذوقك.',
    whyItems: [
      ['01', 'ألوان حسب الطلب', 'اختاري اللون الذي يناسبك بدل التقيد بمجموعة ثابتة.'],
      ['02', 'مقاسات مرنة', '50، 52، 54، 56، 57 مع إمكانية إدخال مقاس خاص.'],
      ['03', 'مناسبات ويومي', 'مجموعتان واضحتان لتسهيل الوصول إلى التصميم المناسب.'],
      ['04', 'طلب مباشر', 'كل تفاصيل الطلب تنتقل إلى واتساب برسالة واحدة جاهزة.'],
    ],
    orderEyebrow: 'تجربة طلب بسيطة',
    orderTitle: 'اختاري. خصّصي. أرسلي.',
    orderSteps: [
      ['01', 'اختاري التصميم', 'اختاري A1 أو A2 أو B1 أو B2.'],
      ['02', 'حددي المقاس واللون', 'اختاري المقاس المعتاد أو مقاسًا خاصًا واكتبي اللون المطلوب.'],
      ['03', 'أرسلي عبر واتساب', 'يُجهّز الموقع رسالة الطلب تلقائيًا لتكمليها مع المتجر.'],
    ],
    orderButton: 'ابدئي الطلب',
    instagramEyebrow: 'تابعينا',
    instagramTitle: '@viscose_design',
    instagramText: 'تابعي أحدث التصاميم والإعلانات من خلال حساب فسكوز على إنستغرام.',
    instagram: 'إنستغرام',
    selectProduct: 'اختيار المنتج',
    size: 'المقاس',
    color: 'اللون المطلوب',
    customSize: 'مقاس خاص',
    customSizePlaceholder: 'اكتبي المقاس المطلوب',
    colorPlaceholder: 'مثال: بنفسجي داكن',
    addToBag: 'إضافة للطلب',
    bag: 'طلبك',
    emptyBag: 'لم تضيفي أي منتج بعد.',
    quantity: 'الكمية',
    remove: 'حذف',
    sendOrder: 'Order via WhatsApp',
    orderNote: 'سيتم تأكيد السعر والتوفر والتفاصيل النهائية مع المتجر عبر واتساب.',
    close: 'إغلاق',
    language: 'EN',
    footer: 'Viscose Design — Muscat, Oman',
    allDesigns: 'كل التصاميم',
    backToCollections: 'العودة للمجموعات',
    homePreviewTitle: 'لمحة من المجموعة',
    homePreviewText: 'ابدئي من أحدث التصاميم، ثم انتقلي لصفحة الجديد لرؤية المجموعة كاملة.',
    seeAll: 'شاهدي الكل',
    productAlt: {
      A1: 'مخوار A1 أزرق فاتح بتطريز على الصدر والأساور',
      A2: 'مخوار A2 أصفر خردلي بتطريز زهور على الصدر والأساور',
      B1: 'مخوار B1 بقماش زيتوني بنقشة ورود برتقالية، وتطريز ذهبي وليلكي حول الرقبة والأكمام، ويظهر مع شيلة بنفسجية داكنة',
      B2: 'مخوار B2 من الدانتيل باللونين الفوشي والبنفسجي، بتطريز ورود على الصدر والأكمام، ويظهر مع شيلة وردية',
    },
    colorOnRequest: 'يمكن تغيير اللون حسب الطلب',
    // Add-on labels follow each product's configured shayla price and optional fixed size.
    shaylaOption: (price, size) => `إضافة شيلة${size ? ` (${size.label})` : ''} (+${toArabicDigits(price)} ر.ع.)`,
    shayla: 'الشيلة',
    shaylaYes: (price, size) => `نعم${size ? `، ${size.label}` : ''} (+${toArabicDigits(price)} ر.ع.)`,
    shaylaNo: 'لا',
    shaylaSizes: { liso: { label: 'مقاس ليسو' } },
    watchVideo: 'شاهدي الفيديو',
    showPhoto: 'عرض الصورة',
    productVideo: (code) => `فيديو مخوار ${code}`,
    shaylaDetails: {
      color: { label: 'لون الشيلة المطلوب', short: 'لون الشيلة' },
      fabric: { label: 'قماش الشيلة المطلوب', short: 'قماش الشيلة', note: 'يمكن تغيير القماش حسب الطلب وتأكيده عبر واتساب' },
    },
    confirmOnWhatsApp: 'يُحدد عبر واتساب',
    unitPrice: 'سعر القطعة',
  },
  en: {
    nav: ['Home', 'New', 'Collections', 'About', 'Fabrics', 'Contact'],
    announcement: 'Custom colors & sizing available',
    heroEyebrow: 'More than fabric',
    heroTitle: 'Quality begins in the smallest details.',
    heroText: 'Viscose creates elevated mukhawars from carefully selected fabrics, balancing heritage, elegance and craftsmanship.',
    explore: 'Explore collection',
    aboutCta: 'About Viscose',
    newEyebrow: 'Just arrived',
    newTitle: 'New designs',
    newText: 'Four initial designs. Final product photography and prices will be added when ready.',
    priceSoon: 'Price coming soon',
    occasion: 'Occasion',
    everyday: 'Everyday',
    collectionsEyebrow: 'Choose your mood',
    collectionsTitle: 'Collections',
    occasionTitle: 'Occasion Mukhawars',
    occasionText: 'A1 · A2 · B1 — richer details for special moments.',
    everydayTitle: 'Everyday Mukhawars',
    everydayText: 'B2 — light, comfortable elegance for everyday wear.',
    viewCollection: 'View collection',
    aboutEyebrow: 'The Viscose story',
    aboutTitle: 'Quiet elegance, shaped by detail.',
    aboutText: 'At Viscose, we believe quality begins in the smallest details. We create elevated mukhawars using carefully selected fabrics that bring together heritage, elegance and craftsmanship.',
    fabricEyebrow: 'Texture & identity',
    fabricTitle: 'Fabrics chosen with intention.',
    fabricText: 'Fabric is not simply a backdrop to the design. It carries the personality of the piece, so every visual choice stays calm, tactile and refined.',
    fabricCards: [
      ['Careful selection', 'Materials chosen to balance comfort and a refined appearance.'],
      ['Considered details', 'Small finishing choices make the difference in every piece.'],
      ['Your color', 'Colors can be changed on request to suit your taste.'],
    ],
    whyEyebrow: 'Why Viscose?',
    whyTitle: 'Designed around your preference.',
    whyItems: [
      ['01', 'Colors on request', 'Choose the color that suits you instead of a fixed palette.'],
      ['02', 'Flexible sizing', '50, 52, 54, 56, 57 plus a custom-size option.'],
      ['03', 'Occasion & everyday', 'Two clear collections make choosing easier.'],
      ['04', 'Direct ordering', 'Your full order is prepared into one WhatsApp message.'],
    ],
    orderEyebrow: 'A simple ordering flow',
    orderTitle: 'Choose. Customize. Send.',
    orderSteps: [
      ['01', 'Choose a design', 'Select A1, A2, B1 or B2.'],
      ['02', 'Set size & color', 'Choose a standard or custom size and add your preferred color.'],
      ['03', 'Send on WhatsApp', 'The site prepares the order message for you automatically.'],
    ],
    orderButton: 'Start an order',
    instagramEyebrow: 'Follow along',
    instagramTitle: '@viscose_design',
    instagramText: 'Follow the latest designs and announcements from Viscose on Instagram.',
    instagram: 'Instagram',
    selectProduct: 'Select product',
    size: 'Size',
    color: 'Preferred color',
    customSize: 'Custom size',
    customSizePlaceholder: 'Enter your preferred size',
    colorPlaceholder: 'Example: deep purple',
    addToBag: 'Add to order',
    bag: 'Your order',
    emptyBag: 'Your order is empty.',
    quantity: 'Quantity',
    remove: 'Remove',
    sendOrder: 'Order via WhatsApp',
    orderNote: 'Price, availability and final details will be confirmed with the store on WhatsApp.',
    close: 'Close',
    language: 'عربي',
    footer: 'Viscose Design — Muscat, Oman',
    allDesigns: 'All designs',
    backToCollections: 'Back to collections',
    homePreviewTitle: 'A glimpse of the collection',
    homePreviewText: 'Start with the latest designs, then open New to see the full collection.',
    seeAll: 'See all',
    productAlt: {
      A1: 'Light blue A1 mukhawar with embroidery on the bodice and cuffs',
      A2: 'Mustard-yellow A2 mukhawar with floral embroidery on the bodice and cuffs',
      B1: 'B1 mukhawar in olive fabric with an orange floral print and gold and lilac embroidery around the neckline and cuffs, shown with a dark plum shayla',
      B2: 'B2 mukhawar in fuchsia and purple lace with floral embroidery on the chest and sleeves, shown with a pink shayla',
    },
    colorOnRequest: 'Color can be changed on request',
    shaylaOption: (price, size) => `Add a ${size ? `${size.adjective} ` : ''}shayla (+${price} OMR)`,
    shayla: 'Shayla',
    shaylaYes: (price, size) => `Yes${size ? `, ${size.label}` : ''} (+${price} OMR)`,
    shaylaNo: 'No',
    shaylaSizes: { liso: { label: 'Liso size', adjective: 'Liso-size' } },
    watchVideo: 'Watch video',
    showPhoto: 'Show photo',
    productVideo: (code) => `${code} mukhawar video`,
    shaylaDetails: {
      color: { label: 'Preferred shayla color', short: 'Shayla color' },
      fabric: { label: 'Preferred shayla fabric', short: 'Shayla fabric', note: 'Fabric can be changed on request and confirmed on WhatsApp' },
    },
    confirmOnWhatsApp: 'To be confirmed on WhatsApp',
    unitPrice: 'Unit price',
  },
}

function getRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return routes.includes(raw) ? raw : 'home'
}

function getCollectionFilter() {
  const query = window.location.hash.split('?')[1] || ''
  return new URLSearchParams(query).get('collection')
}

function Logo({ compact = false, dimensional = false }) {
  return (
    <img
      className={`brand-logo ${compact ? 'brand-logo--compact' : ''} ${dimensional ? 'brand-logo--3d' : ''}`}
      src={LOGO_URL}
      alt="Viscose Design"
    />
  )
}

function ProductGrid({ items, t, selectProduct }) {
  return (
    <div className="product-grid">
      {items.map((product, index) => (
        <article className="product-card" key={product.code}>
          <button className={`product-visual product-visual--${product.tone}${product.photo ? ' product-visual--photo' : ''}`} type="button" onClick={() => selectProduct(product)}>
            <span className="product-index">0{index + 1}</span>
            {product.photo ? (
              <img
                className="product-photo"
                src={product.photo.src}
                width={product.photo.width}
                height={product.photo.height}
                style={product.photo.position ? { objectPosition: product.photo.position } : undefined}
                alt={t.productAlt[product.code]}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <>
                <span className="product-code">{product.code}</span>
                <span className="product-watermark">V</span>
              </>
            )}
          </button>
          <div className="product-meta">
            <div>
              <p>{product.category === 'occasion' ? t.occasion : t.everyday}</p>
              <h3>{product.code}</h3>
            </div>
            <button type="button" className="round-arrow" onClick={() => selectProduct(product)} aria-label={`${t.selectProduct} ${product.code}`}>↗</button>
          </div>
          {product.price == null
            ? <span className="price-placeholder">{t.priceSoon}</span>
            : <bdi className="product-price">{formatPrice(product.price)}</bdi>}
        </article>
      ))}
    </div>
  )
}

function App() {
  const [lang, setLang] = useState('ar')
  const [page, setPage] = useState(getRoute())
  const [collectionFilter, setCollectionFilter] = useState(getCollectionFilter())
  const [activeProduct, setActiveProduct] = useState(null)
  const [size, setSize] = useState('52')
  const [customSize, setCustomSize] = useState('')
  const [color, setColor] = useState('')
  const [withShayla, setWithShayla] = useState(false)
  const [shaylaDetail, setShaylaDetail] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const t = copy[lang]
  const rtl = lang === 'ar'
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const shaylaCopy = activeProduct?.shayla?.detail ? t.shaylaDetails[activeProduct.shayla.detail] : null

  useEffect(() => {
    const onHashChange = () => {
      setPage(getRoute())
      setCollectionFilter(getCollectionFilter())
      setActiveProduct(null)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) window.location.hash = '#/home'
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const pageName = t.nav[routes.indexOf(page)] || 'Viscose Design'
    document.title = `${pageName} — Viscose Design`
  }, [page, t])

  const selectProduct = (product) => {
    setActiveProduct(product)
    setSize('52')
    setCustomSize('')
    setColor('')
    setWithShayla(false)
    setShaylaDetail('')
    setShowVideo(false)
  }

  const addToCart = () => {
    if (!activeProduct) return
    const shaylaConfig = activeProduct.shayla
    const hasShaylaOption = Boolean(shaylaConfig)
    // Products with a shayla option keep blank choices as '' and label them in the current
    // language when shown, so the same choice still groups after a language switch.
    // Other products keep storing the localized fallback.
    const blankValue = (fallback) => (hasShaylaOption ? '' : fallback)
    const chosenSize = size === 'custom' ? customSize.trim() || blankValue(t.customSize) : size
    const chosenColor = color.trim() || blankValue(t.confirmOnWhatsApp)
    const shayla = hasShaylaOption && withShayla
    // A deselected shayla carries no detail (A1/B2 color, B1 fabric). A blank one stays ''.
    // A fixed-size shayla (A2) has no detail at all.
    const chosenShaylaDetail = shayla && shaylaConfig.detail ? shaylaDetail.trim() : null
    // These lines differ by size, garment color, shayla and its detail. A JSON key keeps the
    // free-text fields from colliding the way a hyphen-joined key could.
    const key = hasShaylaOption
      ? JSON.stringify([activeProduct.code, chosenSize, chosenColor, shayla, chosenShaylaDetail])
      : `${activeProduct.code}-${chosenSize}-${chosenColor}`
    const unitPrice = unitPriceFor(activeProduct, shayla)

    setCart((current) => {
      const existing = current.find((item) => item.key === key)
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, {
        key,
        code: activeProduct.code,
        category: activeProduct.category,
        size: chosenSize,
        color: chosenColor,
        quantity: 1,
        ...(hasShaylaOption && { shayla }),
        ...(shayla && { shaylaPrice: shaylaConfig.price }),
        ...(shayla && shaylaConfig.size && { shaylaSize: shaylaConfig.size }),
        ...(shayla && shaylaConfig.detail && { shaylaDetailType: shaylaConfig.detail, shaylaDetail: chosenShaylaDetail }),
        ...(unitPrice != null && { unitPrice }),
      }]
    })

    setActiveProduct(null)
    setCartOpen(true)
  }

  const changeQuantity = (key, amount) => {
    setCart((current) => current
      .map((item) => item.key === key ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item)
      .filter((item) => item.quantity > 0))
  }

  const removeItem = (key) => setCart((current) => current.filter((item) => item.key !== key))

  const whatsappUrl = useMemo(() => {
    const greeting = rtl
      ? 'السلام عليكم، أود طلب المنتجات التالية من Viscose Design:'
      : 'Hello, I would like to order the following from Viscose Design:'
    const labels = copy[rtl ? 'ar' : 'en']
    const lines = cart.map((item, index) => {
      const category = item.category === 'occasion' ? (rtl ? 'مناسبات' : 'Occasion') : (rtl ? 'يومي' : 'Everyday')
      const sizeText = item.size || labels.customSize
      const colorText = item.color || labels.confirmOnWhatsApp
      const details = rtl
        ? [`${index + 1}. المنتج ${item.code} — ${category}`, `المقاس: ${sizeText}`, `اللون: ${colorText}`]
        : [`${index + 1}. Product ${item.code} — ${category}`, `Size: ${sizeText}`, `Color: ${colorText}`]
      if (typeof item.shayla === 'boolean') details.push(`${labels.shayla}: ${item.shayla ? labels.shaylaYes(item.shaylaPrice, shaylaSizeLabel(labels, item.shaylaSize)) : labels.shaylaNo}`)
      if (item.shayla && item.shaylaDetailType) details.push(`${labels.shaylaDetails[item.shaylaDetailType].short}: ${item.shaylaDetail || labels.confirmOnWhatsApp}`)
      if (item.unitPrice != null) details.push(`${labels.unitPrice}: ${formatPrice(item.unitPrice)}`)
      details.push(rtl ? `الكمية: ${item.quantity}` : `Quantity: ${item.quantity}`)
      return details.join('\n')
    })
    const ending = rtl ? 'يرجى تأكيد السعر والتوفر. شكرًا.' : 'Please confirm price and availability. Thank you.'
    // The final, device-specific link comes straight from the current message, so it stays
    // correct after quantity, item or language changes.
    return whatsAppOrderUrl(WHATSAPP_NUMBER, [greeting, '', ...lines, '', ending].join('\n'))
  }, [cart, rtl])

  const filteredProducts = collectionFilter === 'occasion'
    ? products.filter((item) => item.category === 'occasion')
    : collectionFilter === 'everyday'
      ? products.filter((item) => item.category === 'everyday')
      : products

  const openCollection = (category) => {
    window.location.hash = `#/new?collection=${category}`
  }

  const renderPage = () => {
    if (page === 'home') {
      return (
        <>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">{t.heroEyebrow}</p>
              <h1>{t.heroTitle}</h1>
              <p className="hero-text">{t.heroText}</p>
              <div className="hero-actions">
                <a className="button button--primary" href="#/collections">{t.explore}</a>
                <a className="button button--ghost" href="#/about">{t.aboutCta}</a>
              </div>
              <div className="hero-index"><span>01</span><i /><span>03</span></div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-logo-shell"><Logo dimensional /></div>
            </div>
          </section>

          <section className="trust-strip" aria-label="Brand values">
            <span>{rtl ? 'أقمشة مختارة' : 'Selected fabrics'}</span><i />
            <span>{rtl ? 'تفاصيل مدروسة' : 'Considered details'}</span><i />
            <span>{rtl ? 'حسب ذوقك' : 'Made your way'}</span>
          </section>

          <section className="section home-preview">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">{t.newEyebrow}</p>
                <h2>{t.homePreviewTitle}</h2>
                <p className="section-intro">{t.homePreviewText}</p>
              </div>
              <a className="text-link" href="#/new">{t.seeAll} ↗</a>
            </div>
            <ProductGrid items={products.slice(0, 2)} t={t} selectProduct={selectProduct} />
          </section>
        </>
      )
    }

    if (page === 'new') {
      const filterTitle = collectionFilter === 'occasion' ? t.occasionTitle : collectionFilter === 'everyday' ? t.everydayTitle : t.newTitle
      return (
        <main className="page-shell">
          <section className="page-banner page-banner--new">
            <p className="eyebrow">{t.newEyebrow}</p>
            <h1>{filterTitle}</h1>
            <p>{t.newText}</p>
            {collectionFilter && <a className="text-link" href="#/new">{t.allDesigns} ↗</a>}
          </section>
          <section className="section page-products">
            <ProductGrid items={filteredProducts} t={t} selectProduct={selectProduct} />
          </section>
        </main>
      )
    }

    if (page === 'collections') {
      return (
        <main className="page-shell">
          <section className="page-banner page-banner--collections">
            <p className="eyebrow">{t.collectionsEyebrow}</p>
            <h1>{t.collectionsTitle}</h1>
          </section>
          <section className="section collections-page">
            <div className="collection-grid">
              <button className="collection-card collection-card--occasion" type="button" onClick={() => openCollection('occasion')}>
                <span className="collection-no">01</span>
                <div><p>Viscose Design</p><h3>{t.occasionTitle}</h3><span>{t.occasionText}</span></div>
                <b>{t.viewCollection} ↗</b>
              </button>
              <button className="collection-card collection-card--everyday" type="button" onClick={() => openCollection('everyday')}>
                <span className="collection-no">02</span>
                <div><p>Viscose Design</p><h3>{t.everydayTitle}</h3><span>{t.everydayText}</span></div>
                <b>{t.viewCollection} ↗</b>
              </button>
            </div>
          </section>
        </main>
      )
    }

    if (page === 'about') {
      return (
        <main className="page-shell">
          <section className="section about about-page">
            <div className="about-visual">
              <div className="about-logo-shell"><Logo dimensional /></div>
            </div>
            <div className="about-copy">
              <p className="eyebrow">{t.aboutEyebrow}</p>
              <h1 className="page-title">{t.aboutTitle}</h1>
              <p>{t.aboutText}</p>
              <div className="about-signature">Viscose Design</div>
              <a className="button button--ghost" href="#/fabrics">{t.nav[4]} ↗</a>
            </div>
          </section>
        </main>
      )
    }

    if (page === 'fabrics') {
      return (
        <main className="page-shell fabrics-page">
          <section className="fabric-story">
            <div className="fabric-story-copy">
              <p className="eyebrow">{t.fabricEyebrow}</p>
              <h1 className="page-title page-title--light">{t.fabricTitle}</h1>
              <p>{t.fabricText}</p>
            </div>
            <div className="fabric-sculpture" aria-hidden="true" />
            <div className="fabric-values">
              {t.fabricCards.map(([title, text], index) => (
                <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </section>

          <section className="section why-viscose">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">{t.whyEyebrow}</p><h2>{t.whyTitle}</h2></div>
              <span className="section-number">VISCOSE / 04</span>
            </div>
            <div className="why-grid">
              {t.whyItems.map(([number, title, text]) => (
                <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </section>
        </main>
      )
    }

    return (
      <main className="page-shell contact-page">
        <section className="page-banner page-banner--contact">
          <p className="eyebrow">{t.orderEyebrow}</p>
          <h1>{t.orderTitle}</h1>
        </section>
        <section className="order-experience">
          <div className="order-heading">
            <p className="eyebrow">Viscose Design</p>
            <h2>{t.orderTitle}</h2>
          </div>
          <div className="order-steps">
            {t.orderSteps.map(([number, title, text]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>
            ))}
          </div>
          <button className="button button--light" type="button" onClick={() => setCartOpen(true)}>{t.orderButton}</button>
        </section>
        <section className="section instagram-band">
          <div>
            <p className="eyebrow">{t.instagramEyebrow}</p>
            <h2>{t.instagramTitle}</h2>
            <p>{t.instagramText}</p>
          </div>
          <a className="button button--ghost" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{t.instagram} ↗</a>
        </section>
      </main>
    )
  }

  return (
    <div className={`app ${rtl ? 'rtl' : 'ltr'}`} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="announcement">
        <span>{t.announcement}</span>
        <span className="announcement-dot" />
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@viscose_design</a>
      </div>

      <header className="site-header">
        <div className="header-actions">
          <button className="language-button" type="button" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t.language}</button>
          <button className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label={t.bag}>
            <span>{t.bag}</span><b>{cartCount}</b>
          </button>
        </div>

        <nav className="nav" aria-label="Primary navigation">
          {routes.map((route, index) => (
            <a className={page === route ? 'active' : ''} key={route} href={`#/${route}`}>{t.nav[index]}</a>
          ))}
        </nav>

        <a className="brand-link" href="#/home" aria-label="Viscose Design home">
          <span>Viscose Design</span>
          <Logo compact />
        </a>
      </header>

      {renderPage()}

      <footer>
        <div className="footer-brand"><Logo compact /><span>{t.footer}</span></div>
        <span>© {new Date().getFullYear()}</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@viscose_design</a>
      </footer>

      {activeProduct && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setActiveProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setActiveProduct(null)} aria-label={t.close}>×</button>
            <div className={`modal-art product-visual--${activeProduct.tone}${activeProduct.photo ? ' modal-art--photo' : ''}${showVideo ? ' modal-art--video' : ''}`}>
              {showVideo && activeProduct.video ? (
                // Mounted only on request, so the video is not downloaded until then.
                <video
                  className="modal-video"
                  src={activeProduct.video.src}
                  width={activeProduct.video.width}
                  height={activeProduct.video.height}
                  poster={activeProduct.photo?.src}
                  aria-label={t.productVideo(activeProduct.code)}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                />
              ) : activeProduct.photo ? (
                <img
                  className="modal-photo"
                  src={activeProduct.photo.src}
                  width={activeProduct.photo.width}
                  height={activeProduct.photo.height}
                  style={activeProduct.photo.position ? { objectPosition: activeProduct.photo.position } : undefined}
                  alt={t.productAlt[activeProduct.code]}
                />
              ) : (
                <><span>{activeProduct.code}</span><b>Viscose Design</b></>
              )}
              {activeProduct.video && (
                <button className="media-toggle" type="button" aria-pressed={showVideo} onClick={() => setShowVideo((current) => !current)}>
                  {showVideo ? t.showPhoto : <><span aria-hidden="true">▶</span> {t.watchVideo}</>}
                </button>
              )}
            </div>
            <div className="modal-content">
              <p className="eyebrow">{activeProduct.category === 'occasion' ? t.occasion : t.everyday}</p>
              <h2>{activeProduct.code}</h2>
              {activeProduct.price == null
                ? <span className="modal-price">{t.priceSoon}</span>
                : <span className="modal-price modal-price--set" aria-live="polite"><bdi>{formatPrice(unitPriceFor(activeProduct, withShayla))}</bdi></span>}
              <fieldset>
                <legend>{t.size}</legend>
                <div className="size-grid">
                  {standardSizes.map((item) => <button className={size === item ? 'selected' : ''} type="button" key={item} onClick={() => setSize(item)}>{item}</button>)}
                  <button className={size === 'custom' ? 'selected' : ''} type="button" onClick={() => setSize('custom')}>{t.customSize}</button>
                </div>
              </fieldset>
              {size === 'custom' && (
                <label className="field"><span>{t.customSize}</span><input value={customSize} onChange={(event) => setCustomSize(event.target.value)} placeholder={t.customSizePlaceholder} /></label>
              )}
              <label className={`field${activeProduct.colorOnRequest ? ' field--with-hint' : ''}`}>
                <span>{t.color}</span>
                <input
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  placeholder={t.colorPlaceholder}
                  aria-describedby={activeProduct.colorOnRequest ? 'color-on-request' : undefined}
                />
              </label>
              {activeProduct.colorOnRequest && <p className="field-hint" id="color-on-request">{t.colorOnRequest}</p>}
              {activeProduct.shayla ? (
                <label className="shayla-option">
                  <input type="checkbox" checked={withShayla} onChange={(event) => setWithShayla(event.target.checked)} />
                  <span>{t.shaylaOption(activeProduct.shayla.price, shaylaSizeLabel(t, activeProduct.shayla.size))}</span>
                </label>
              ) : null}
              {shaylaCopy && withShayla ? (
                <>
                  <label className={`field shayla-detail-field${shaylaCopy.note ? ' field--with-hint' : ''}`}>
                    <span>{shaylaCopy.label}</span>
                    <input
                      value={shaylaDetail}
                      onChange={(event) => setShaylaDetail(event.target.value)}
                      placeholder={t.confirmOnWhatsApp}
                      aria-describedby={shaylaCopy.note ? 'shayla-detail-note' : undefined}
                    />
                  </label>
                  {shaylaCopy.note && <p className="field-hint" id="shayla-detail-note">{shaylaCopy.note}</p>}
                </>
              ) : null}
              <button className="button button--primary button--full" type="button" onClick={addToCart}>{t.addToBag}</button>
            </div>
          </section>
        </div>
      )}

      <aside className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`} aria-hidden={!cartOpen}>
        <div className="cart-header"><div><p className="eyebrow">Viscose Design</p><h2>{t.bag} <sup>{cartCount}</sup></h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label={t.close}>×</button></div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart"><Logo compact /><p>{t.emptyBag}</p><a href="#/new" onClick={() => setCartOpen(false)}>{t.explore}</a></div>
          ) : cart.map((item) => (
            <article className="cart-item" key={item.key}>
              <div className="cart-item-code">{item.code}</div>
              <div className="cart-item-info">
                <strong>{item.code}</strong><span>{t.size}: {item.size || t.customSize}</span><span>{t.color}: {item.color || t.confirmOnWhatsApp}</span>
                {typeof item.shayla === 'boolean' && <span>{t.shayla}: {item.shayla ? t.shaylaYes(item.shaylaPrice, shaylaSizeLabel(t, item.shaylaSize)) : t.shaylaNo}</span>}
                {item.shayla && item.shaylaDetailType && <span>{t.shaylaDetails[item.shaylaDetailType].label}: {item.shaylaDetail || t.confirmOnWhatsApp}</span>}
                {item.unitPrice != null && <span>{t.unitPrice}: <bdi>{formatPrice(item.unitPrice)}</bdi></span>}
                <div className="quantity-controls"><button type="button" onClick={() => changeQuantity(item.key, -1)}>−</button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.key, 1)}>+</button></div>
                <button className="remove-button" type="button" onClick={() => removeItem(item.key)}>{t.remove}</button>
              </div>
            </article>
          ))}
        </div>
        <div className="cart-footer"><p>{t.orderNote}</p>{cart.length > 0 && <a className="button button--primary button--full" href={whatsappUrl} target="_blank" rel="noreferrer">{t.sendOrder}</a>}</div>
      </aside>

      {cartOpen && <button className="drawer-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label={t.close} />}
    </div>
  )
}

export default App
