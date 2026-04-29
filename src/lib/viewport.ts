export function setupViewportHeight() {
  const setViewportHeight = () => {
    const visualViewportHeight = window.visualViewport?.height ?? 0
    const viewportHeight = visualViewportHeight || window.innerHeight

    document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`)
  }

  setViewportHeight()

  window.addEventListener('resize', setViewportHeight)
  window.addEventListener('orientationchange', setViewportHeight)
  window.visualViewport?.addEventListener('resize', setViewportHeight)
}
