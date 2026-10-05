// Generates the QR codes for the page and for the SIH PPT.
//
//   npm run qr
//
// Every QR encodes SITE_URL exactly (src/config.ts → AURA_SITE_URL must
// match). Error correction H, 4-module quiet zone, black on white, nothing
// drawn over the modules — reliability first.

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const SITE_URL = 'https://h2s-dosimeter-landing.vercel.app/'
const OUT = new URL('../public/qr/', import.meta.url)

const options = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: { dark: '#000000', light: '#ffffff' },
}

await mkdir(OUT, { recursive: true })

// Plain QR — used on the page and in the PPT.
const svg = await QRCode.toString(SITE_URL, { ...options, type: 'svg' })
await writeFile(new URL('aura-one-download-qr.svg', OUT), svg)
await QRCode.toFile(
  fileURLToPath(new URL('aura-one-download-qr.png', OUT)),
  SITE_URL,
  { ...options, type: 'png', width: 2048 },
)

// PPT companion: the same, unmodified QR with a label below it.
const qr = QRCode.create(SITE_URL, { errorCorrectionLevel: 'H' })
const n = qr.modules.size
const margin = 4
const cell = 20
const side = (n + margin * 2) * cell
const labelH = 260
let rects = ''
for (let y = 0; y < n; y++) {
  for (let x = 0; x < n; x++) {
    if (qr.modules.get(x, y)) {
      rects += `<rect x="${(x + margin) * cell}" y="${(y + margin) * cell}" width="${cell}" height="${cell}"/>`
    }
  }
}
const companion = `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side + labelH}" viewBox="0 0 ${side} ${side + labelH}">
<title>Scan to try Aura One</title>
<rect width="${side}" height="${side + labelH}" fill="#ffffff"/>
<g fill="#000000" shape-rendering="crispEdges">${rects}</g>
<text x="${side / 2}" y="${side + 70}" text-anchor="middle" font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="64" font-weight="600" letter-spacing="6" fill="#4b5563">SCAN TO TRY</text>
<text x="${side / 2}" y="${side + 170}" text-anchor="middle" font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="104" font-weight="800" letter-spacing="2" fill="#1f5f1a">AURA ONE</text>
</svg>
`
await writeFile(new URL('aura-one-scan-to-try.svg', OUT), companion)

console.log(`QR (${n}×${n} modules, ECC H) → ${SITE_URL}`)
