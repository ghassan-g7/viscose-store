/* Touch feedback for tappable cards (product, collection and close-up cards).

   While a finger or pen rests on a card it gets .is-pressed: the card lifts slightly and a warm
   glow rings its frame (see "Pressed and focused cards" in styles.css). The effect is visual only.
   The card's own <a> or <button> still handles activation, and every listener is passive, so one
   tap still opens the item and scrolling, zooming and long-press menus stay native.

   Like the platform's own pressed states, the effect waits a moment before showing, so a scroll
   that merely starts on a card never lights it up. It clears on release, on cancel (the browser
   taking the touch over for a scroll or a long-press menu), on any scroll and when the page loses
   focus. Mouse presses are left to the existing hover styles. */

const CARD = '.product-card__link, .collection-card, .detail-tile__media'
const SHOW_DELAY = 90 // ms a finger must rest before the card shows as pressed
const MOVE_SLOP = 10 // px a finger may drift before the touch counts as a scroll

let press = null // { card, pointerId, x, y, timer }

function release() {
  if (!press) return
  clearTimeout(press.timer)
  press.card.classList.remove('is-pressed')
  press = null
}

document.addEventListener('pointerdown', (event) => {
  release()
  if (event.pointerType === 'mouse' || !event.isPrimary) return
  const card = event.target instanceof Element ? event.target.closest(CARD) : null
  if (!card) return
  const current = { card, pointerId: event.pointerId, x: event.clientX, y: event.clientY, timer: 0 }
  current.timer = setTimeout(() => {
    if (press === current) card.classList.add('is-pressed')
  }, SHOW_DELAY)
  press = current
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
