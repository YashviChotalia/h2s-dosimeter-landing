import { useEffect, useState } from 'react'
import { AURA_APK_ASSET, AURA_RELEASE_API } from '../config'

/**
 * - `available`   — the latest release carries the APK.
 * - `unavailable` — there is no release, or it has no APK: say so.
 * - `unknown`     — could not check (offline, API rate limit): stay usable.
 */
export type ApkAvailability = 'checking' | 'available' | 'unavailable' | 'unknown'

export function useApkAvailability(): ApkAvailability {
  const [state, setState] = useState<ApkAvailability>(
    AURA_RELEASE_API ? 'checking' : 'unknown',
  )

  useEffect(() => {
    if (!AURA_RELEASE_API) return
    const controller = new AbortController()
    fetch(AURA_RELEASE_API, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(async (res) => {
        if (res.status === 404) return setState('unavailable')
        if (!res.ok) return setState('unknown')
        const release = (await res.json()) as { assets?: { name: string }[] }
        const found = release.assets?.some((a) => a.name === AURA_APK_ASSET)
        setState(found ? 'available' : 'unavailable')
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setState('unknown')
      })
    return () => controller.abort()
  }, [])

  return state
}
