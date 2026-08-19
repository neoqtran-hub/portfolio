/* Nav + lottie behavior, mirroring the live Simpluris header interactions. */
(function () {
  'use strict';

  var mq = window.matchMedia('(max-width: 900px)');
  var items = Array.prototype.slice.call(document.querySelectorAll('li.has-submenu'));
  var opener = document.querySelector('.nav-opener');
  var closeTimer;

  function setOpen(li, open) {
    li.classList.toggle('open', open);
    var a = li.querySelector(':scope > a');
    if (a) a.setAttribute('aria-expanded', String(open));
  }

  function closeAll(except) {
    items.forEach(function (li) { if (li !== except) setOpen(li, false); });
  }

  items.forEach(function (li) {
    var link = li.querySelector(':scope > a');

    // Desktop: hover opens, with a small grace period so diagonal
    // mouse travel into the panel doesn't dismiss it.
    li.addEventListener('mouseenter', function () {
      if (mq.matches) return;
      clearTimeout(closeTimer);
      closeAll(li);
      setOpen(li, true);
    });
    li.addEventListener('mouseleave', function () {
      if (mq.matches) return;
      closeTimer = setTimeout(function () { setOpen(li, false); }, 160);
    });

    // Top-level links are section landing pages on the live site, but the
    // parent acts as a toggle on touch/mobile rather than navigating away.
    link.addEventListener('click', function (e) {
      if (!mq.matches) return;
      e.preventDefault();
      var isOpen = li.classList.contains('open');
      closeAll(li);
      setOpen(li, !isOpen);
    });

    // Keyboard: focus within the item keeps the panel open.
    li.addEventListener('focusin', function () {
      if (mq.matches) return;
      closeAll(li);
      setOpen(li, true);
    });
    li.addEventListener('focusout', function () {
      if (mq.matches) return;
      setTimeout(function () {
        if (!li.contains(document.activeElement)) setOpen(li, false);
      }, 0);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll(null);
      document.body.classList.remove('nav-open');
      if (opener) opener.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', function (e) {
    if (!mq.matches && !e.target.closest('#header')) closeAll(null);
  });

  if (opener) {
    opener.addEventListener('click', function () {
      var open = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', open);
      opener.setAttribute('aria-expanded', String(open));
      if (!open) closeAll(null);
    });
  }

  // Reset nav state when crossing the mobile/desktop breakpoint so a menu
  // left open in one mode doesn't persist into the other.
  mq.addEventListener('change', function () {
    document.body.classList.remove('nav-open');
    closeAll(null);
    if (opener) opener.setAttribute('aria-expanded', 'false');
  });

  /* ---------- Lottie ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-lottie]').forEach(function (el) {
    var anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: el.getAttribute('data-lottie'),
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
    });

    // Some compositions are authored on a canvas much larger than their
    // artwork. data-viewbox retargets the SVG to the content bounds so the
    // animation fills its frame instead of floating in empty padding.
    var crop = el.getAttribute('data-viewbox');
    if (crop) {
      anim.addEventListener('DOMLoaded', function () {
        var svg = el.querySelector('svg');
        if (svg) svg.setAttribute('viewBox', crop);
      });
    }

    if (reduced) {
      // Show a representative still rather than looping motion.
      anim.addEventListener('DOMLoaded', function () { anim.goToAndStop(0, true); });
      return;
    }

    // Only animate while on screen — these are large compositions.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) anim.play();
        else anim.pause();
      });
    }, { threshold: 0.15 });
    io.observe(el);
  });
})();
