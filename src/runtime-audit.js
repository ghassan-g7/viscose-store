/* Small progressive-enhancement layer for semantics and overlay behavior.
   It does not own application state; it only mirrors the rendered React state. */

let previousLayer = null
let returnFocusTo = null

function getAppDirection() {
  return document.querySelector('.app')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
}

function getOpenLayer() {
  return document.querySelector('.product-modal') || document.querySelector('.cart-drawer--open')
}

function focusableElements(root) {
  if (!root) return []
  return [...root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hasAttribute('inert') && element.getClientRects().length > 0)
}

function syncDocumentLanguage() {
  const direction = getAppDirection()
  document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en'
  document.documentElement.dir = direction
}

function syncSemanticCopy() {
  const bagCount = document.querySelector('.bag-button b')
  if (bagCount) {
    bagCount.setAttribute('aria-live', 'polite')
    bagCount.setAttribute('aria-atomic', 'true')
  }
}

function syncCartState() {
  const drawer = document.querySelector('.cart-drawer')
  if (!drawer) return

  const empty = Boolean(drawer.querySelector('.empty-cart'))
  drawer.classList.toggle('cart-drawer--empty', empty)
  drawer.classList.toggle('cart-drawer--filled', !empty)

  const open = drawer.classList.contains('cart-drawer--open')
  drawer.inert = !open
}

function syncQuantityLabels() {
  const rtl = getAppDirection() === 'rtl'
  document.querySelectorAll('.quantity-controls').forEach((controls) => {
    const buttons = controls.querySelectorAll('button')
    if (buttons[0]) buttons[0].setAttribute('aria-label', rtl ? 'تقليل الكمية' : 'Decrease quantity')
    if (buttons[1]) buttons[1].setAttribute('aria-label', rtl ? 'زيادة الكمية' : 'Increase quantity')
  })
}

function syncExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
    const rel = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean))
    rel.add('noopener')
    rel.add('noreferrer')
    anchor.setAttribute('rel', [...rel].join(' '))
  })
}

function syncOverlayState() {
  const layer = getOpenLayer()
  document.body.classList.toggle('viscose-overlay-open', Boolean(layer))

  if (layer && layer !== previousLayer) {
    returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
    requestAnimationFrame(() => {
      const first = focusableElements(layer)[0]
      first?.focus({ preventScroll: true })
    })
  } else if (!layer && previousLayer && returnFocusTo?.isConnected) {
    requestAnimationFrame(() => returnFocusTo?.focus({ preventScroll: true }))
  }

  previousLayer = layer
}

function syncAll() {
  syncDocumentLanguage()
  syncSemanticCopy()
  syncCartState()
  syncQuantityLabels()
  syncExternalLinks()
  syncOverlayState()
}

function onKeyDown(event) {
  const layer = getOpenLayer()
  if (!layer) return

  if (event.key === 'Escape') {
    event.preventDefault()
    const closeButton = layer.matches('.product-modal')
      ? layer.querySelector('.modal-close')
      : layer.querySelector('.cart-header > button')
    closeButton?.click()
    return
  }

  if (event.key !== 'Tab') return

  const focusables = focusableElements(layer)
  if (focusables.length === 0) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const observer = new MutationObserver(syncAll)

function startRuntimeAudit() {
  syncAll()
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'dir', 'aria-hidden'],
  })
  document.addEventListener('keydown', onKeyDown)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startRuntimeAudit, { once: true })
} else {
  startRuntimeAudit()
}
