// The ONLY place the page's URLs are defined. See README.md → "Updating the APK".
//
// Each value can be overridden at build time with a Vite env variable
// (Vercel → Project → Settings → Environment Variables), so changing the APK
// or the repository never requires touching a component.

/** The public project repository — the "View on GitHub" target. */
export const AURA_GITHUB_REPO =
  import.meta.env.VITE_AURA_GITHUB_REPO ?? 'AdityaJadhav13/MRPL-Aura-One'

export const AURA_GITHUB_URL =
  import.meta.env.VITE_AURA_GITHUB_URL ?? `https://github.com/${AURA_GITHUB_REPO}`

/**
 * The APK file name attached to every GitHub Release of AURA_GITHUB_REPO.
 * GitHub's `releases/latest/download/<name>` always serves this asset from the
 * newest published (non-draft, non-prerelease) release.
 */
export const AURA_APK_ASSET =
  import.meta.env.VITE_AURA_APK_ASSET ?? 'MRPL-Aura-One.apk'

/** What "Download App" fetches. One source of truth. */
export const AURA_APK_URL =
  import.meta.env.VITE_AURA_APK_URL ??
  `https://github.com/${AURA_GITHUB_REPO}/releases/latest/download/${AURA_APK_ASSET}`

/**
 * Used only to confirm, in the background, that the latest release really
 * carries AURA_APK_ASSET — so a missing APK shows "Download is temporarily
 * unavailable" instead of a GitHub 404. Null when the APK URL is overridden.
 */
export const AURA_RELEASE_API = import.meta.env.VITE_AURA_APK_URL
  ? null
  : `https://api.github.com/repos/${AURA_GITHUB_REPO}/releases/latest`

/** The canonical page URL. The QR codes in public/qr encode exactly this. */
export const AURA_SITE_URL = 'https://h2s-dosimeter-landing.vercel.app/'
