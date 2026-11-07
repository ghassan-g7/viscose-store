/* WhatsApp order links, built directly from the current order message.
   Phones and tablets get the official wa.me link so the WhatsApp app opens directly;
   desktop browsers go straight to WhatsApp Web instead of through the wa.me redirect. */

// Android, iPhone and iPod name themselves in the user agent. iPadOS sends a desktop Mac
// user agent, so it is recognised by the MacIntel platform together with touch support.
export function isMobileOrTablet(nav = globalThis.navigator) {
  if (!nav) return false
  const ua = nav.userAgent || ''
  const classicMobile = /Android|iPhone|iPod/i.test(ua)
  const iPadOS = nav.platform === 'MacIntel' && nav.maxTouchPoints > 1
  return classicMobile || iPadOS
}

export function whatsAppOrderUrl(phone, message, nav = globalThis.navigator) {
  const text = encodeURIComponent(message)
  return isMobileOrTablet(nav)
    ? `https://wa.me/${phone}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`
}
