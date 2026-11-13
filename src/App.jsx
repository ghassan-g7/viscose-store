import { useEffect, useMemo, useState } from 'react'
import LOGO_DATA_URL from './logoData'
import { copy } from './copy'
import { images } from './media'
import { galleryIndex, productByCode, products, standardSizes } from './products'
import { whatsAppOrderUrl } from './whatsapp'

const WHATSAPP_NUMBER = '96892708027'
const INSTAGRAM_URL = 'https://www.instagram.com/viscose_design'
const routes = ['home', 'new', 'collections', 'about', 'fabrics', 'contact']

const formatPrice = (amount) => `${amount} OMR`
const shaylaSizeLabel = (labels, sizeKey) => (sizeKey ? labels.shaylaSizes[sizeKey] : null)

function unitPriceFor(product, withShayla) {
  if (product.price == null) return null
  return product.price + (withShayla && product.shayla ? product.shayla.price : 0)
}

function getRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return routes.includes(raw) ? raw : 'home'
}

function getCollectionFilter() {
  const query = window.location.hash.split('?')[1] || ''
  return new URLSearchParams(query).get('collection')
}

function Logo({ compact = false }) {
  return (
    <img
      className={`brand-logo${compact ? ' brand-logo--compact' : ''}`}
      src={LOGO_DATA_URL}
      alt="Viscose Design"
    />
  )
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function BagIcon() {
  return (
    <svg className="bag-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Responsive photo: every processed width is in srcSet, and `sizes` describes the slot it fills.
function Picture({ image, alt, sizes, className, eager = false }) {
  return (
    <img
      className={className}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  )
}

function ProductCard({ product, t, onSelect }) {
  const main = product.gallery[0]
  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__link"
        onClick={() => onSelect(product)}
        aria-label={`${t.selectProduct} ${product.code}, ${product.price == null ? t.priceSoon : formatPrice(product.price)}`}
      >
        <span className="product-card__media">
          <Picture
            image={main.image}
            alt={t.galleryAlt[product.code].main}
            sizes="(max-width: 979px) 46vw, 290px"
          />
          {product.video && (
            <span className="product-card__badge"><span aria-hidden="true">▶</span> {t.videoBadge}</span>
          )}
        </span>
        <span className="product-card__meta">
          <span className="product-card__category">{product.category === 'occasion' ? t.occasion : t.everyday}</span>
          <span className="product-card__code">{product.code}</span>
          {product.price == null
            ? <span className="product-card__price">{t.priceSoon}</span>
            : <bdi className="product-card__price">{formatPrice(product.price)}</bdi>}
        </span>
      </button>
    </article>
  )
}

function ProductGrid({ items, t, onSelect }) {
  return (
    <div className="product-grid">
      {items.map((product) => <ProductCard key={product.code} product={product} t={t} onSelect={onSelect} />)}
    </div>
  )
}

// Close-up tiles; each opens its product on the matching detail photo.
function DetailTiles({ codes, t, onSelect }) {
  return (
    <div className="detail-grid">
      {codes.map((code) => {
        const product = productByCode(code)
        const index = galleryIndex(product, 'detail')
        return (
          <figure className="detail-tile" key={code}>
            <button type="button" className="detail-tile__media" onClick={() => onSelect(product, index)} aria-label={t.viewProduct(code)}>
              <Picture
                image={product.gallery[index].image}
                alt={t.galleryAlt[code].detail}
                sizes="(max-width: 699px) 78vw, (max-width: 1099px) 46vw, 400px"
              />
            </button>
            <figcaption><span className="detail-tile__code">{code}</span>{t.detailCaptions[code]}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}

function OrderSteps({ t, onStart, showHeading = true }) {
  return (
    <section className="band band--cream">
      <div className={`shell order${showHeading ? '' : ' order--steps-only'}`}>
        {showHeading && (
          <div className="order__heading">
            <p className="eyebrow">{t.orderEyebrow}</p>
            <h2>{t.orderTitle}</h2>
          </div>
        )}
        <ol className="order__steps">
          {t.orderSteps.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
        <button className="button button--primary order__button" type="button" onClick={onStart}>{t.orderButton}</button>
      </div>
    </section>
  )
}

function InstagramBand({ t }) {
  return (
    <section className="band band--plum">
      <div className="shell instagram">
        <div>
          <p className="eyebrow">{t.instagramEyebrow}</p>
          <h2>{t.instagramTitle}</h2>
          <p>{t.instagramText}</p>
        </div>
        <a className="button button--light" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{t.instagram} <Arrow /></a>
      </div>
    </section>
  )
}

function CollectionCard({ href, number, title, text, pictures, t }) {
  return (
    <a className="collection-card" href={href}>
      <span className={`collection-card__media collection-card__media--${pictures.length}`}>
        {pictures.map(({ image, alt }) => (
          <Picture key={image.src} image={image} alt={alt} sizes="(max-width: 899px) 31vw, 250px" />
        ))}
      </span>
      <span className="collection-card__body">
        <span className="collection-card__number">{number}</span>
        <span className="collection-card__title">{title}</span>
        <span className="collection-card__text">{text}</span>
        <span className="text-link">{t.viewCollection} <Arrow /></span>
      </span>
    </a>
  )
}

function App() {
  const [lang, setLang] = useState('ar')
  const [page, setPage] = useState(getRoute())
  const [collectionFilter, setCollectionFilter] = useState(getCollectionFilter())
  const [activeProduct, setActiveProduct] = useState(null)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [size, setSize] = useState('52')
  const [customSize, setCustomSize] = useState('')
  const [color, setColor] = useState('')
  const [withShayla, setWithShayla] = useState(false)
  const [shaylaDetail, setShaylaDetail] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const t = copy[lang]
  const rtl = lang === 'ar'
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const shaylaCopy = activeProduct?.shayla?.detail ? t.shaylaDetails[activeProduct.shayla.detail] : null
  const categoryLabel = (product) => (product.category === 'occasion' ? t.occasion : t.everyday)

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

  const selectProduct = (product, startIndex = 0) => {
    setActiveProduct(product)
    setMediaIndex(startIndex)
    setShowVideo(false)
    setSize('52')
    setCustomSize('')
    setColor('')
    setWithShayla(false)
    setShaylaDetail('')
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
    // A deselected shayla carries no detail (A1/A2/B2 color, B1 fabric). A blank one stays ''.
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

  const activeFilter = collectionFilter === 'occasion' || collectionFilter === 'everyday' ? collectionFilter : null
  const filteredProducts = activeFilter ? products.filter((item) => item.category === activeFilter) : products

  const renderPage = () => {
    if (page === 'home') {
      return (
        <main className="page page--home">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero__inner shell">
              <div className="hero__panel">
                <h1 id="hero-title">{t.heroTitle}</h1>
                <p className="hero__line">{t.heroText}</p>
                <a className="button button--primary hero__button" href="#/new">{t.explore}</a>
              </div>
              <figure className="hero__media">
                <Picture image={images.heroA2} alt={t.heroAlt} sizes="(max-width: 899px) 100vw, 50vw" eager />
              </figure>
            </div>
          </section>

          <section className="values shell" aria-label={t.valuesLabel}>
            {t.values.map((value) => <span key={value}>{value}</span>)}
          </section>

          <section className="section shell" aria-labelledby="home-collection-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.newEyebrow}</p>
                <h2 id="home-collection-title">{t.homeCollectionTitle}</h2>
                <p>{t.homeCollectionText}</p>
              </div>
              <a className="text-link" href="#/new">{t.seeAll} <Arrow /></a>
            </div>
            <ProductGrid items={products} t={t} onSelect={selectProduct} />
          </section>

          <section className="section section--flush-top shell" aria-labelledby="home-details-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.detailsEyebrow}</p>
                <h2 id="home-details-title">{t.detailsTitle}</h2>
                <p>{t.detailsText}</p>
              </div>
              <a className="text-link" href="#/fabrics">{t.detailsLink} <Arrow /></a>
            </div>
            <DetailTiles codes={['A2', 'B1', 'B2']} t={t} onSelect={selectProduct} />
          </section>

          <OrderSteps t={t} onStart={() => setCartOpen(true)} />
          <InstagramBand t={t} />
        </main>
      )
    }

    if (page === 'new') {
      const filterTitle = activeFilter === 'occasion' ? t.occasionTitle : activeFilter === 'everyday' ? t.everydayTitle : t.newTitle
      const filters = [[null, t.filterAll, '#/new'], ['occasion', t.occasion, '#/new?collection=occasion'], ['everyday', t.everyday, '#/new?collection=everyday']]
      return (
        <main className="page">
          <header className="page-intro shell">
            <p className="eyebrow">{t.newEyebrow}</p>
            <h1>{filterTitle}</h1>
            <p>{t.newText}</p>
          </header>
          <nav className="filters shell" aria-label={t.filterLabel}>
            {filters.map(([key, label, href]) => (
              <a key={href} href={href} className={activeFilter === key ? 'active' : ''} aria-current={activeFilter === key ? 'page' : undefined}>{label}</a>
            ))}
          </nav>
          <section className="section section--tight shell">
            <ProductGrid items={filteredProducts} t={t} onSelect={selectProduct} />
          </section>
        </main>
      )
    }

    if (page === 'collections') {
      const occasionPictures = products
        .filter((product) => product.category === 'occasion')
        .map((product) => ({ image: product.gallery[0].image, alt: t.galleryAlt[product.code].main }))
      const b2 = productByCode('B2')
      const everydayPictures = b2.gallery.map((item) => ({ image: item.image, alt: t.galleryAlt.B2[item.view] }))
      return (
        <main className="page">
          <header className="page-intro shell">
            <p className="eyebrow">{t.collectionsEyebrow}</p>
            <h1>{t.collectionsTitle}</h1>
          </header>
          <section className="section section--tight shell collections">
            <CollectionCard href="#/new?collection=occasion" number="01" title={t.occasionTitle} text={t.occasionText} pictures={occasionPictures} t={t} />
            <CollectionCard href="#/new?collection=everyday" number="02" title={t.everydayTitle} text={t.everydayText} pictures={everydayPictures} t={t} />
          </section>
        </main>
      )
    }

    if (page === 'about') {
      return (
        <main className="page">
          <section className="about shell">
            <figure className="about__media">
              <Picture image={images.a1Door} alt={t.aboutAlt} sizes="(max-width: 899px) 100vw, 44vw" eager />
            </figure>
            <div className="about__copy">
              <p className="eyebrow">{t.aboutEyebrow}</p>
              <h1>{t.aboutTitle}</h1>
              <p className="lead">{t.aboutText}</p>
              <p className="signature">Viscose Design</p>
              <a className="button button--ghost" href="#/fabrics">{t.nav[4]} <Arrow /></a>
            </div>
          </section>
        </main>
      )
    }

    if (page === 'fabrics') {
      return (
        <main className="page">
          <header className="page-intro shell">
            <p className="eyebrow">{t.fabricEyebrow}</p>
            <h1>{t.fabricTitle}</h1>
            <p>{t.fabricText}</p>
          </header>
          <section className="section section--tight shell" aria-labelledby="close-ups-title">
            <div className="section-heading section-heading--small">
              <div>
                <h2 id="close-ups-title">{t.closeUpsTitle}</h2>
                <p>{t.closeUpsText}</p>
              </div>
            </div>
            <DetailTiles codes={['A1', 'A2', 'B1', 'B2']} t={t} onSelect={selectProduct} />
          </section>
          <section className="section section--flush-top shell">
            <div className="feature-grid">
              {t.fabricCards.map(([title, text], index) => (
                <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </section>
          <section className="section section--flush-top shell" aria-labelledby="why-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.whyEyebrow}</p>
                <h2 id="why-title">{t.whyTitle}</h2>
              </div>
            </div>
            <div className="feature-grid feature-grid--four">
              {t.whyItems.map(([number, title, text]) => (
                <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </section>
        </main>
      )
    }

    return (
      <main className="page">
        <header className="page-intro shell">
          <p className="eyebrow">{t.orderEyebrow}</p>
          <h1>{t.orderTitle}</h1>
        </header>
        <OrderSteps t={t} onStart={() => setCartOpen(true)} showHeading={false} />
        <InstagramBand t={t} />
      </main>
    )
  }

  const gallery = activeProduct?.gallery || []
  const activeImage = gallery[Math.min(mediaIndex, gallery.length - 1)]
  const video = activeProduct?.video

  return (
    <div className={`app ${rtl ? 'rtl' : 'ltr'}`} dir={rtl ? 'rtl' : 'ltr'} lang={lang}>
      <div className="announcement">
        <span>{t.announcement}</span>
        <span className="announcement-dot" aria-hidden="true" />
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@viscose_design</a>
      </div>

      <header className="site-header">
        <div className="site-header__inner shell">
          <a className="brand-link" href="#/home" aria-label={t.homeLabel}>
            <Logo compact />
            <span className="brand-link__name">Viscose Design</span>
          </a>

          <nav className="nav" aria-label={t.navLabel}>
            {routes.map((route, index) => (
              <a className={page === route ? 'active' : ''} aria-current={page === route ? 'page' : undefined} key={route} href={`#/${route}`}>{t.nav[index]}</a>
            ))}
          </nav>

          <div className="header-actions">
            <button className="language-button" type="button" lang={rtl ? 'en' : 'ar'} aria-label={t.languageName} onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t.language}</button>
            <button className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label={t.bag}>
              <BagIcon /><span>{t.bag}</span><b>{cartCount}</b>
            </button>
          </div>
        </div>
      </header>

      {renderPage()}

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <div className="footer-brand"><Logo compact /><span>{t.footer}</span></div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@viscose_design</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      {activeProduct && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setActiveProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setActiveProduct(null)} aria-label={t.close}>×</button>

            <div className="modal-media">
              <div className={`media-stage${showVideo ? ' media-stage--video' : ''}`}>
                {showVideo && video ? (
                  // Mounted only on request, so the video is not downloaded until then. It plays
                  // silently and repeats in place until the customer returns to a photo.
                  // No browser controls (or cast button) cover the garment.
                  <video
                    className="modal-video"
                    src={video.src}
                    width={video.width}
                    height={video.height}
                    poster={video.poster}
                    aria-label={t.productVideo(activeProduct.code)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    disableRemotePlayback
                    preload="auto"
                  />
                ) : (
                  <Picture
                    className="modal-photo"
                    image={activeImage.image}
                    alt={t.galleryAlt[activeProduct.code][activeImage.view]}
                    sizes="(max-width: 899px) 100vw, 540px"
                    eager
                  />
                )}
                {video && (
                  <button className="media-toggle" type="button" aria-pressed={showVideo} onClick={() => setShowVideo((current) => !current)}>
                    {showVideo ? t.showPhoto : <><span aria-hidden="true">▶</span> {t.watchVideo}</>}
                  </button>
                )}
              </div>

              {(gallery.length > 1 || video) && (
                <div className="media-thumbs" role="group" aria-label={t.galleryLabel}>
                  {gallery.map((item, index) => {
                    const current = !showVideo && item === activeImage
                    return (
                      <button
                        key={item.view}
                        type="button"
                        className={`media-thumb${current ? ' is-active' : ''}`}
                        aria-pressed={current}
                        aria-label={t.photoLabel(index + 1, gallery.length)}
                        onClick={() => { setMediaIndex(index); setShowVideo(false) }}
                      >
                        <img src={item.image.src} srcSet={item.image.srcSet} sizes="72px" width={item.image.width} height={item.image.height} alt="" loading="lazy" decoding="async" />
                      </button>
                    )
                  })}
                  {video && (
                    <button
                      type="button"
                      className={`media-thumb media-thumb--video${showVideo ? ' is-active' : ''}`}
                      aria-pressed={showVideo}
                      aria-label={t.watchVideo}
                      onClick={() => setShowVideo(true)}
                    >
                      <img src={video.poster} width={video.width} height={video.height} alt="" loading="lazy" decoding="async" />
                      <span className="media-thumb__play" aria-hidden="true">▶</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="modal-content">
              <p className="eyebrow">{categoryLabel(activeProduct)}</p>
              <h2 id="product-modal-title" className="modal-code">{activeProduct.code}</h2>
              {activeProduct.price == null
                ? <span className="modal-price">{t.priceSoon}</span>
                : <span className="modal-price" aria-live="polite"><bdi>{formatPrice(unitPriceFor(activeProduct, withShayla))}</bdi></span>}
              <fieldset>
                <legend>{t.size}</legend>
                <div className="size-grid">
                  {standardSizes.map((item) => (
                    <button className={size === item ? 'selected' : ''} aria-pressed={size === item} type="button" key={item} onClick={() => setSize(item)}>{item}</button>
                  ))}
                  <button className={`size-grid__custom${size === 'custom' ? ' selected' : ''}`} aria-pressed={size === 'custom'} type="button" onClick={() => setSize('custom')}>{t.customSize}</button>
                </div>
              </fieldset>
              {size === 'custom' && (
                <label className="field"><span>{t.customSize}</span><input value={customSize} onChange={(event) => setCustomSize(event.target.value)} placeholder={t.customSizePlaceholder} /></label>
              )}
              <div className="field-group">
                <label className="field">
                  <span>{t.color}</span>
                  <input
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    placeholder={t.colorPlaceholder}
                    aria-describedby={activeProduct.colorOnRequest ? 'color-on-request' : undefined}
                  />
                </label>
                {activeProduct.colorOnRequest && <p className="field-hint" id="color-on-request">{t.colorOnRequest}</p>}
              </div>
              {activeProduct.shayla ? (
                <label className="shayla-option">
                  <input type="checkbox" checked={withShayla} onChange={(event) => setWithShayla(event.target.checked)} />
                  <span>{t.shaylaOption(activeProduct.shayla.price, shaylaSizeLabel(t, activeProduct.shayla.size))}</span>
                </label>
              ) : null}
              {shaylaCopy && withShayla ? (
                <div className="field-group">
                  <label className="field">
                    <span>{shaylaCopy.label}</span>
                    <input
                      value={shaylaDetail}
                      onChange={(event) => setShaylaDetail(event.target.value)}
                      placeholder={t.confirmOnWhatsApp}
                      aria-describedby={shaylaCopy.note ? 'shayla-detail-note' : undefined}
                    />
                  </label>
                  {shaylaCopy.note && <p className="field-hint" id="shayla-detail-note">{shaylaCopy.note}</p>}
                </div>
              ) : null}
              <button className="button button--primary button--full" type="button" onClick={addToCart}>{t.addToBag}</button>
              <p className="modal-note">{t.orderNote}</p>
            </div>
          </section>
        </div>
      )}

      <aside className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`} aria-hidden={!cartOpen} aria-label={t.bag}>
        <div className="cart-header"><div><p className="eyebrow">Viscose Design</p><h2>{t.bag} <sup>{cartCount}</sup></h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label={t.close}>×</button></div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart"><Logo compact /><p>{t.emptyBag}</p><a href="#/new" onClick={() => setCartOpen(false)}>{t.explore}</a></div>
          ) : cart.map((item) => {
            const thumb = productByCode(item.code)?.gallery[0].image
            return (
              <article className="cart-item" key={item.key}>
                <div className="cart-item-thumb">
                  {thumb && <img src={thumb.src} srcSet={thumb.srcSet} sizes="80px" width={thumb.width} height={thumb.height} alt="" loading="lazy" decoding="async" />}
                </div>
                <div className="cart-item-info">
                  <strong>{item.code}</strong><span>{t.size}: {item.size || t.customSize}</span><span>{t.color}: {item.color || t.confirmOnWhatsApp}</span>
                  {typeof item.shayla === 'boolean' && <span>{t.shayla}: {item.shayla ? t.shaylaYes(item.shaylaPrice, shaylaSizeLabel(t, item.shaylaSize)) : t.shaylaNo}</span>}
                  {item.shayla && item.shaylaDetailType && <span>{t.shaylaDetails[item.shaylaDetailType].label}: {item.shaylaDetail || t.confirmOnWhatsApp}</span>}
                  {item.unitPrice != null && <span>{t.unitPrice}: <bdi>{formatPrice(item.unitPrice)}</bdi></span>}
                  <div className="quantity-controls"><button type="button" onClick={() => changeQuantity(item.key, -1)}>−</button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.key, 1)}>+</button></div>
                  <button className="remove-button" type="button" onClick={() => removeItem(item.key)}>{t.remove}</button>
                </div>
              </article>
            )
          })}
        </div>
        <div className="cart-footer"><p>{t.orderNote}</p>{cart.length > 0 && <a className="button button--primary button--full" href={whatsappUrl} target="_blank" rel="noreferrer">{t.sendOrder}</a>}</div>
      </aside>

      {cartOpen && <button className="drawer-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label={t.close} />}
    </div>
  )
}

export default App
