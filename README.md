# MRPL - Aura One — download page

The page the SIH 2026 PPT QR code opens: <https://h2s-dosimeter-landing.vercel.app/>

One job: get a judge from the QR code into the Aura One Android app.

```
scan PPT QR → this page → Download App → APK downloads → Android asks to allow/install → Open
```

A website cannot install an APK. The browser downloads it; Android then asks the user to allow the
install (unknown-source prompt) and to tap **Install**. Nothing here bypasses or hides that.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS 4, deployed on Vercel as a static site (no backend).

```bash
npm install
npm run dev       # local development
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run lint
npm run qr        # regenerate the QR codes in public/qr/
```

## Where things are

| What | Where |
|---|---|
| **All URLs** (APK, GitHub, site) — the one place to change them | [`src/config.ts`](src/config.ts) |
| Page layout | `src/App.tsx`, `src/index.css` |
| Components | `src/components/` — `BrandLockup`, `QRCodeCard`, `DownloadButton`, `GitHubButton`, `PhoneMockup` |
| APK availability check | `src/hooks/useApkAvailability.ts` |
| App screenshot in the phone | `public/app/final-read-*.webp` — rendered by the Aura One app's own widgets (Final Aura Band Read) |
| Logos | `public/brand/` — `mrpl-logo.png` (MRPL tile), `aura-wordmark.png` (cut from the official MRPL × aura lockup, recoloured) |
| QR codes | `public/qr/` |
| Social preview | `public/og-image.png` |

## Updating the APK

The **Download App** button always fetches

```
https://github.com/AdityaJadhav13/MRPL-Aura-One/releases/latest/download/MRPL-Aura-One.apk
```

GitHub resolves `releases/latest/download/<file>` to that file in the **newest published release**
of the project repository. So updating the app never needs a code change or a redeploy:

1. Build the release APK in the project repository
   (`cd app && flutter build apk --release --flavor dev -t lib/main_dev.dart`), from a clean,
   committed tree with a new version number, and record its SHA-256 in `dist/SHA256SUMS`.
2. Rename the file to exactly **`MRPL-Aura-One.apk`**.
3. Publish a GitHub Release on **AdityaJadhav13/MRPL-Aura-One** (not a draft, not a pre-release)
   with that file attached, e.g.

   ```bash
   gh release create v0.7.0+15 MRPL-Aura-One.apk \
     -R AdityaJadhav13/MRPL-Aura-One --title "Aura One 0.7.0+15" \
     --notes "SHA-256: <hash>"
   ```

4. Done — the page downloads it immediately. To roll back, delete or unpublish the newer release.

On load the page asks the GitHub API (`/releases/latest`) whether that release really has
`MRPL-Aura-One.apk`. If there is no release or no such file, the button is disabled and the page
says **"Download is temporarily unavailable."** If the API cannot be reached (offline, rate limit),
the button stays usable.

### Changing the source without touching code

Set any of these in Vercel → Project → Settings → Environment Variables, then redeploy:

| Variable | Default |
|---|---|
| `VITE_AURA_GITHUB_REPO` | `AdityaJadhav13/MRPL-Aura-One` (release source and GitHub button) |
| `VITE_AURA_GITHUB_URL` | `https://github.com/<repo>` |
| `VITE_AURA_APK_ASSET` | `MRPL-Aura-One.apk` |
| `VITE_AURA_APK_URL` | `https://github.com/<repo>/releases/latest/download/<asset>` — set this to host the APK anywhere else (the availability check is then skipped) |

The APK is deliberately **not** in this repository or the Vercel build: it is ~75 MB, changes
independently of the page, and GitHub Releases is built for large binaries.

## QR codes (`public/qr/`)

All encode exactly `https://h2s-dosimeter-landing.vercel.app/`, error correction **H**, 4-module
quiet zone, black on white, nothing over the modules. Verified with an independent decoder.

| File | Use |
|---|---|
| `aura-one-download-qr.svg` | **PPT** (vector, scales without loss) and the page |
| `aura-one-download-qr.png` | PPT, 2048 × 2048 |
| `aura-one-scan-to-try.svg` / `.png` | PPT companion: the same QR with "SCAN TO TRY · AURA ONE" below |

If the canonical URL ever changes, update `SITE_URL` in `scripts/generate-qr.mjs` and
`AURA_SITE_URL` in `src/config.ts`, then run `npm run qr`.

## Layout

- **Phones** (most judges arrive from the PPT QR on a phone): brand → MRPL - AURA ONE → phone →
  full-width **Download App** → View on GitHub. No QR. The Download button is on the first screen
  at 360 × 800 and up.
- **Desktop** (≥ 1024 px): brand, title, QR and buttons on the left; the phone on the right; fits
  in one 1366 × 768 screen.
- Motion is limited to a short fade-in and a 4 px float on the phone, and is off under
  `prefers-reduced-motion`. No analytics.
