/**
 * Applies the persisted theme and text direction to <html> *before* first paint.
 *
 * Without this the page renders light + LTR from the server, then the provider's
 * effect corrects it after hydration — a visible flash for anyone whose saved
 * preference is dark or RTL.
 *
 * WHY A RAW <script> AND NOT next/script:
 * `next/script` with strategy="beforeInteractive" does not emit a directly
 * executable tag — it queues the code into `self.__next_s`, which Next's runtime
 * drains once its own bundle loads. That is after first paint, so the flash this
 * component exists to prevent comes back. A plain <script> in <head> is parsed
 * and executed by the browser synchronously during document parsing, which is
 * the only thing fast enough.
 *
 * React warns "Scripts inside React components are never executed when rendering
 * on the client" for any raw <script>. That warning does not apply here: this
 * component is only ever rendered on the server, inside the root layout's <head>,
 * so the browser — not React — executes it. It is never mounted client-side.
 *
 * Keep it small and dependency-free: it runs synchronously and blocks parsing.
 */
const script = `
(function(){
  try {
    var d = document.documentElement;
    if (localStorage.getItem("mw-theme") === "dark") d.classList.add("dark");
    d.setAttribute("dir", localStorage.getItem("mw-dir") === "rtl" ? "rtl" : "ltr");
  } catch (e) {}
})();
`;

export function PrefsScript() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <script
      id="mw-prefs"
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
