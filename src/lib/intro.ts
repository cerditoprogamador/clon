// Shared intro timing so the preloader and the hero entrance animations stay in sync.
// The preloader covers the screen for INTRO_REVEAL seconds, then slides up to reveal
// the page. Hero animations add INTRO_REVEAL as a base delay so they play AS the
// preloader uncovers them — not hidden behind it.
export const INTRO_REVEAL = 1.1;
