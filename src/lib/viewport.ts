function getStandaloneScreenHeight() {
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && window.navigator.standalone === true)

  if (!isStandalone) return 0

  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  return isPortrait ? window.screen.height : window.screen.width
}

export function setupViewportHeight() {
  const setViewportHeight = () => {
    const visualViewportHeight = window.visualViewport?.height ?? 0
    const viewportHeight = Math.max(
      window.innerHeight,
      visualViewportHeight,
      getStandaloneScreenHeight(),
    )

    document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`)
  }

  setViewportHeight()

  window.addEventListener('resize', setViewportHeight)
  window.addEventListener('orientationchange', setViewportHeight)
  window.visualViewport?.addEventListener('resize', setViewportHeight)
}
