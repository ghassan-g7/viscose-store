/* Touch feedback for tappable cards and navigation links: product, collection and close-up
   cards, the page links in the phone header and the filter chips.

   The moment a finger or pen touches one it gets .is-pressed: a slight lift and a soft gold glow
   around its outer edge (see "Pressed and focused cards and links" in styles.css), so even a quick
   tap is acknowledged. The effect is visual only. The element's own <a> or <button> still handles
   activation, and every listener is passive, so one tap still opens the item and scrolling,
   zooming and long-press menus stay native.

   It clears when the finger lifts and as soon as the touch turns into a scroll: the finger drifts
   more than a few pixels, the browser takes the touch over for scrolling (pointercancel), or
   anything scrolls. It also clears when the page loses focus. Mouse presses are left to the
   existing hover styles. */

const TARGET = '.product-card__link, .collection-card, .detail-tile__media, .nav a, .filters a'
const MOVE_SLOP = 8 // px a finger may drift before the touch counts as a scroll

let press = null // { el, pointerId, x, y }

function release() {
  if (!press) return
  press.el.classList.remove('is-pressed')
  press = null
}

document.addEventListener('pointerdown', (event) => {
  release()
  if (event.pointerType === 'mouse' || !event.isPrimary) return
  const el = event.target instanceof Element ? event.target.closest(TARGET) : null
  if (!el) return
  el.classList.add('is-pressed')
  press = { el, pointerId: event.pointerId, x: event.clientX, y: event.clientY }
}, { passive: true })

document.addEventListener('pointermove', (event) => {
  if (!press || event.pointerId !== press.pointerId) return
  if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > MOVE_SLOP) release()
}, { passive: true })

document.addEventListener('pointerup', (event) => {
  if (press && event.pointerId === press.pointerId) release()
}, { passive: true })

document.addEventListener('pointercancel', release, { passive: true })
document.addEventListener('contextmenu', release)
document.addEventListener('visibilitychange', release)
window.addEventListener('scroll', release, { passive: true, capture: true })
window.addEventListener('blur', release)
window.addEventListener('pagehide', release)
