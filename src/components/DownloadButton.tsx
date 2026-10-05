import { useEffect, useRef, useState } from 'react'
import { AURA_APK_ASSET, AURA_APK_URL } from '../config'
import { useApkAvailability } from '../hooks/useApkAvailability'
import { ChevronIcon, DownloadIcon } from './Icons'

type Phase = 'idle' | 'downloading' | 'started'

const isIOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

/**
 * The primary action: a real link to the latest APK. The browser downloads it;
 * Android then asks the user to allow and install it. Nothing is automatic.
 */
export function DownloadButton() {
  const availability = useApkAvailability()
  const [phase, setPhase] = useState<Phase>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const unavailable = availability === 'unavailable'

  const status = unavailable
    ? 'Download is temporarily unavailable.'
    : phase === 'downloading'
      ? 'Downloading Aura One…'
      : phase === 'started'
        ? 'Open the downloaded APK to install Aura One.'
        : isIOS
          ? 'Aura One is an Android app. Open this page on an Android phone to install it.'
          : ''

  return (
    <div className="download">
      <a
        className="btn-primary"
        href={unavailable ? undefined : AURA_APK_URL}
        download={AURA_APK_ASSET}
        aria-disabled={unavailable || undefined}
        role={unavailable ? 'link' : undefined}
        tabIndex={unavailable ? 0 : undefined}
        onClick={(e) => {
          if (unavailable) {
            e.preventDefault()
            return
          }
          setPhase('downloading')
          window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setPhase('started'), 2600)
        }}
      >
        <DownloadIcon />
        <span className="btn-primary-label">Download App</span>
        <ChevronIcon />
      </a>
      <p
        className={`download-status${unavailable ? ' download-status--error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </div>
  )
}
