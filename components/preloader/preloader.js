/* Premium logo preloader.
   Change this path if the website logo file changes later. */
const PRELOADER_LOGO_PATH = 'assets/images/eslogo.png';

(function initPreloader() {
  const startedAt = Date.now();
  const minimumVisibleMs = 650;

  const preloader = document.createElement('div');
  preloader.className = 'site-preloader';
  preloader.setAttribute('role', 'status');
  preloader.setAttribute('aria-label', 'Loading ES Happy Tours');

  const mark = document.createElement('div');
  mark.className = 'site-preloader-mark';

  const logo = document.createElement('img');
  logo.className = 'site-preloader-logo';
  logo.src = PRELOADER_LOGO_PATH;
  logo.alt = 'ES Happy Tours';

  mark.appendChild(logo);
  preloader.appendChild(mark);

  const attach = () => {
    if (!document.body || document.querySelector('.site-preloader')) return;
    document.body.prepend(preloader);
  };

  const hide = () => {
    const elapsed = Date.now() - startedAt;
    const delay = Math.max(0, minimumVisibleMs - elapsed);

    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      window.setTimeout(() => preloader.remove(), 650);
    }, delay);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach, { once: true });
  } else {
    attach();
  }

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide, { once: true });
  }
})();
