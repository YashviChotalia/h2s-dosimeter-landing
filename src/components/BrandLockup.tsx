/** MRPL logo | Aura wordmark — the official artwork, never redrawn. */
export function BrandLockup() {
  return (
    <div className="brand" role="img" aria-label="MRPL and Aura">
      <img className="brand-mrpl" src="/brand/mrpl-logo.png" alt="" width="317" height="316" />
      <span className="brand-divider" aria-hidden="true" />
      <img className="brand-aura" src="/brand/aura-wordmark.png" alt="" width="486" height="195" />
    </div>
  )
}
