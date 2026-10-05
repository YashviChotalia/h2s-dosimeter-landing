import { AURA_GITHUB_URL } from '../config'
import { ExternalIcon, GitHubIcon } from './Icons'

export function GitHubButton() {
  return (
    <a className="btn-secondary" href={AURA_GITHUB_URL} target="_blank" rel="noopener noreferrer">
      <GitHubIcon />
      <span>View on GitHub</span>
      <ExternalIcon />
    </a>
  )
}
