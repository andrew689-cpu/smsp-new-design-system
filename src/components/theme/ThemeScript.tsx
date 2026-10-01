/**
 * Applies the stored theme before first paint.
 *
 * Without this the page renders in the system theme and then snaps to the stored choice,
 * which is both ugly and a flash of the wrong contrast. Runs before hydration, so it is a
 * raw script rather than an effect.
 *
 * Three states, matching the token layer: an explicit choice stamps data-theme; the default
 * leaves it absent and lets prefers-color-scheme decide.
 */
export function ThemeScript() {
  const script = `
    try {
      var stored = localStorage.getItem('smsp-theme');
      if (stored === 'light' || stored === 'dark') {
        document.documentElement.setAttribute('data-theme', stored);
      }
    } catch (e) {
      /* Private mode or blocked storage: fall through to prefers-color-scheme. */
    }
  `.trim();

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
