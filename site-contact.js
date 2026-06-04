/* Shared contact section — one source, injected into every page.
   Each page provides a mount: <div id="site-contact"></div>
   (if absent, it's appended to <body>). Include after the page content:
   <script src="site-contact.js"></script> */
(function () {
  if (window.__siteContactInit) return;
  window.__siteContactInit = true;

  var css = [
    '.site-contact{background:var(--bg-soft);padding:100px 32px;position:relative;z-index:1;}',
    '.site-contact-inner{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;align-items:flex-start;gap:14px;}',
    '.site-contact h2{font-family:var(--display,inherit);font-weight:700;letter-spacing:-0.02em;line-height:1.05;font-size:clamp(32px,4vw,46px);color:var(--ink);}',
    '.site-contact p{color:var(--muted);font-size:18px;max-width:560px;}',
    '.site-contact-cta{margin-top:8px;display:inline-flex;align-items:center;justify-content:center;padding:15px 28px;border-radius:var(--pill-radius,999px);background:var(--btn-bg,var(--ink));color:var(--btn-ink,var(--bg));font-family:var(--display,inherit);font-size:15px;font-weight:600;transition:transform .2s ease,opacity .2s ease;}',
    '.site-contact-cta:hover{transform:translateY(-1px);opacity:0.92;}',
    '.site-contact-links{display:flex;flex-wrap:wrap;gap:24px;margin-top:18px;color:var(--muted);font-size:14px;}',
    '.site-contact-links a{color:var(--muted);transition:color .2s ease;}',
    '.site-contact-links a:hover{color:var(--ink);}',
    '.site-contact-note{margin-top:40px;font-size:11px;line-height:1.5;color:var(--muted-soft,var(--muted));opacity:0.85;white-space:nowrap;}',
    '@media (max-width:560px){.site-contact-note{white-space:normal;}}',
    '@media (max-width:560px){.site-contact{padding:72px 20px;}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'site-contact-css';
  style.textContent = css;
  document.head.appendChild(style);

  var markup =
    '<section class="site-contact" id="contact" aria-label="Contact">' +
      '<div class="site-contact-inner">' +
        '<h2>Let\'s Work Together</h2>' +
        '<p>Good designs start with good intentions.</p>' +
        '<a class="site-contact-cta" href="mailto:neoqtran@gmail.com?subject=Let%27s%20work%20together">Make Good Work Together!</a>' +
        '<div class="site-contact-links">' +
          '<a href="https://www.linkedin.com/in/neo-tran-29476370/" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="mailto:neoqtran@gmail.com">neoqtran@gmail.com</a>' +
          '<a href="Assets/Neo%20Tran%20Resume.pdf" download>CV</a>' +
        '</div>' +
        '<p class="site-contact-note">This website was conceived in a threesome, in a summer night, between me, Codex &amp; Claude.</p>' +
      '</div>' +
    '</section>';

  function init() {
    var mount = document.getElementById('site-contact');
    if (!mount) {
      mount = document.createElement('div');
      document.body.appendChild(mount);
    }
    mount.innerHTML = markup;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
