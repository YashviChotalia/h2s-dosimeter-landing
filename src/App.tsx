import { BrandLockup } from './components/BrandLockup'
import { DownloadButton } from './components/DownloadButton'
import { GitHubButton } from './components/GitHubButton'
import { PhoneMockup } from './components/PhoneMockup'
import { QRCodeCard } from './components/QRCodeCard'

/**
 * The SIH PPT QR lands here. One job: get the judge into the app.
 * Mobile order: brand → title → phone → Download → GitHub (no QR).
 * Desktop: brand, title, QR and buttons on the left; the phone on the right.
 */
export default function App() {
  return (
    <main className="page">
      <div className="backdrop" aria-hidden="true">
        <svg className="waves" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-40 700 C 300 600, 520 820, 860 720 S 1300 560, 1500 640" />
          <path d="M-40 760 C 320 660, 560 880, 900 780 S 1320 620, 1500 700" />
          <path d="M900 -20 C 1050 120, 1180 80, 1500 220" />
        </svg>
      </div>

      <div className="hero">
        <div className="hero-brand">
          <BrandLockup />
        </div>
        <h1 className="hero-title">MRPL - AURA ONE</h1>
        <div className="hero-qr">
          <QRCodeCard />
        </div>
        <div className="hero-phone">
          <PhoneMockup />
        </div>
        <div className="hero-actions">
          <DownloadButton />
          <GitHubButton />
          <p className="hero-tag">SIH 2026 · PS SIH26118</p>
        </div>
      </div>
    </main>
  )
}
