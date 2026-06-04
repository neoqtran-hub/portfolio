/* Shared page transition — edge-glow "wormhole" blur warp between pages.
   Self-injects its CSS + overlay markup and hooks every internal *.html link.
   Include on every page: <script src="page-transition.js"></script> */
(function () {
  if (window.__pageTransitionInit) return;
  window.__pageTransitionInit = true;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '.wormhole-wrap{position:fixed;inset:0;z-index:99999;pointer-events:none;display:none;overflow:hidden;}',
    '.wormhole-wrap.active{display:block;}',
    '.edge-glow{position:absolute;inset:0;pointer-events:none;opacity:0;mix-blend-mode:screen;will-change:opacity,box-shadow;}',
    '.edge-glow.l1{box-shadow:inset 0 0 60px 10px rgba(255,255,255,0.95),inset 0 0 140px 30px rgba(218,165,32,0.85);}',
    '.edge-glow.l2{box-shadow:inset 0 0 90px 18px rgba(255,120,200,0.85),inset 0 0 220px 50px rgba(120,90,255,0.55);}',
    '.edge-glow.l3{box-shadow:inset 0 0 110px 24px rgba(60,200,255,0.8),inset 0 0 280px 70px rgba(80,255,180,0.45);}',
    '.wormhole-wrap.out .edge-glow.l1{animation:edge-pulse 1.4s cubic-bezier(0.22,0.61,0.36,1) 0s forwards;}',
    '.wormhole-wrap.out .edge-glow.l2{animation:edge-pulse 1.4s cubic-bezier(0.22,0.61,0.36,1) 0.16s forwards;}',
    '.wormhole-wrap.out .edge-glow.l3{animation:edge-pulse 1.4s cubic-bezier(0.22,0.61,0.36,1) 0.32s forwards;}',
    '.wormhole-wrap.in .edge-glow.l3{animation:edge-pulse-in 1.3s cubic-bezier(0.16,1,0.3,1) 0s forwards;}',
    '.wormhole-wrap.in .edge-glow.l2{animation:edge-pulse-in 1.3s cubic-bezier(0.16,1,0.3,1) 0.16s forwards;}',
    '.wormhole-wrap.in .edge-glow.l1{animation:edge-pulse-in 1.3s cubic-bezier(0.16,1,0.3,1) 0.32s forwards;}',
    '@keyframes edge-pulse{0%{opacity:0;transform:scale(1);}25%{opacity:1;}60%{opacity:0.85;}100%{opacity:0;transform:scale(1.02);}}',
    '@keyframes edge-pulse-in{0%{opacity:0;transform:scale(1.02);}30%{opacity:0.9;}100%{opacity:0;transform:scale(1);}}',
    'body.warp-out #page-warp{animation:page-blur-out 1.3s cubic-bezier(0.65,0,0.35,1) both;will-change:filter,opacity;}',
    '@keyframes page-blur-out{0%{filter:blur(0) saturate(1);opacity:1;}50%{filter:blur(10px) saturate(1.18);opacity:1;}100%{filter:blur(32px) saturate(1.25);opacity:0;}}',
    'body.warp-in #page-warp{animation:page-blur-in 1.3s cubic-bezier(0.16,1,0.3,1) both;will-change:filter,opacity;}',
    '@keyframes page-blur-in{0%{filter:blur(32px) saturate(1.25);opacity:0;}40%{opacity:1;}100%{filter:blur(0) saturate(1);opacity:1;}}',
    'body.warp-out,body.warp-in{overflow:hidden !important;}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'page-transition-css';
  style.textContent = css;
  document.head.appendChild(style);

  function init() {
    var body = document.body;

    var wormholeEl = document.getElementById('wormhole');
    if (!wormholeEl) {
      wormholeEl = document.createElement('div');
      wormholeEl.className = 'wormhole-wrap';
      wormholeEl.id = 'wormhole';
      wormholeEl.setAttribute('aria-hidden', 'true');
      wormholeEl.innerHTML =
        '<div class="edge-glow l1"></div><div class="edge-glow l2"></div><div class="edge-glow l3"></div>';
      body.appendChild(wormholeEl);
    }

    // Wrap page content so it can be blurred/faded as one layer.
    var wrap = document.getElementById('page-warp');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'page-warp';
      Array.prototype.slice.call(body.childNodes).forEach(function (node) {
        if (node === wormholeEl || node === wrap) return;
        if (node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) return;
        wrap.appendChild(node);
      });
      body.insertBefore(wrap, body.firstChild);
    }

    // Arrival animation if we just warped here.
    try {
      var raw = sessionStorage.getItem('warpFrom');
      if (raw) {
        var data = JSON.parse(raw);
        if (!prefersReduced && data && (Date.now() - data.t) < 3000) {
          wormholeEl.classList.add('active', 'in');
          body.classList.add('warp-in');
          setTimeout(function () {
            wormholeEl.classList.remove('active', 'in');
            body.classList.remove('warp-in');
          }, 1500);
        }
        sessionStorage.removeItem('warpFrom');
      }
    } catch (e) {}

    // Hook internal page links.
    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest ? e.target.closest('a[href$=".html"]') : null;
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (href.indexOf('http') === 0 || href.indexOf('//') === 0) return;
      if (link.target === '_blank') return;
      e.preventDefault();
      if (prefersReduced) { window.location.href = href; return; }
      wormholeEl.classList.add('active', 'out');
      body.classList.add('warp-out');
      try { sessionStorage.setItem('warpFrom', JSON.stringify({ t: Date.now() })); } catch (err) {}
      setTimeout(function () { window.location.href = href; }, 1300);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
