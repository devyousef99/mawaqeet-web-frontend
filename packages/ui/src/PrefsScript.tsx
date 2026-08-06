/**
 * Applies the persisted theme and text direction to <html> *before* first paint.
 *
 * Without this the page always renders light + LTR on the server, then the
 * provider's effect corrects it after hydration — a visible flash for anyone
 * whose saved preference is dark or RTL. Runs synchronously in <head>, so it
 * must stay small and dependency-free.
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
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
