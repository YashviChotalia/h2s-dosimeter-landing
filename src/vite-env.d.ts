/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AURA_GITHUB_REPO?: string
  readonly VITE_AURA_GITHUB_URL?: string
  readonly VITE_AURA_APK_ASSET?: string
  readonly VITE_AURA_APK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
