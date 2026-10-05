import { AURA_SITE_URL } from '../config'

/** Desktop only: the same QR as the PPT, so a phone can pick the page up. */
export function QRCodeCard() {
  return (
    <figure className="qr-card">
      <img
        src="/qr/aura-one-download-qr.svg"
        width="148"
        height="148"
        alt={`QR code that opens ${AURA_SITE_URL}`}
      />
    </figure>
  )
}
