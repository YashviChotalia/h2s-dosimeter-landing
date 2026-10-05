/** The real Final Aura Band Read screen, rendered by the app, in a phone. */
export function PhoneMockup() {
  return (
    <div className="phone-stage">
      <div className="phone">
        <span className="phone-button phone-button--power" aria-hidden="true" />
        <span className="phone-button phone-button--volume" aria-hidden="true" />
        <div className="phone-screen">
          <div className="phone-status" aria-hidden="true">
            <span className="phone-time">9:41</span>
            <span className="phone-island" />
            <span className="phone-indicators">
              <svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
              <svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Z"/><path d="M3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.2 1.2a4.8 4.8 0 0 0-6.8 0Z"/><path d="M1.1 4.5a9.8 9.8 0 0 1 13.8 0l-1.2 1.2a8.1 8.1 0 0 0-11.4 0Z"/></svg>
              <svg viewBox="0 0 27 12" width="27" height="12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="19" height="8" rx="2"/><rect x="24" y="4" width="2" height="4" rx="1"/></svg>
            </span>
          </div>
          <img
            className="phone-app"
            src="/app/final-read-780.webp"
            srcSet="/app/final-read-520.webp 520w, /app/final-read-780.webp 780w, /app/final-read-1170.webp 1170w"
            sizes="(min-width: 1024px) 340px, 300px"
            width="780"
            height="1688"
            alt="MRPL - Aura One application showing a completed Aura Band reading: 4.2 ppm·h estimated cumulative external H₂S exposure, Aura Band AB-2026-0010, 4-hour measurement, and an 8-hour time-weighted average of 0.53 ppm"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  )
}
