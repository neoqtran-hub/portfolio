// Shared alt project behavior. Canon: drsquatch-alt.html
(function () {
  var t = document.getElementById('themeToggle');

  if (t && t.parentElement !== document.body) {
    document.body.appendChild(t);
  }

  function syncPressed() {
    if (t) {
      t.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'light' ? 'true' : 'false');
    }
  }

  // Time of day decides the theme (light 7am–7pm, dark otherwise). A manual
  // toggle writes an override that lasts only for the current day/night period,
  // then the time-based default resumes.
  function currentBucket() {
    var h = new Date().getHours();
    return (h >= 7 && h < 19) ? 'day' : 'night';
  }
  function resolveTheme() {
    var theme = currentBucket() === 'day' ? 'light' : 'dark';
    try {
      var raw = localStorage.getItem('themeOverride');
      if (raw) { var o = JSON.parse(raw); if (o && o.bucket === currentBucket()) theme = o.theme; else localStorage.removeItem('themeOverride'); }
    } catch (e) {}
    return theme;
  }
  function applyTheme(theme) {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    syncPressed();
  }

  applyTheme(resolveTheme());

  if (t) {
    t.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('themeOverride', JSON.stringify({ theme: next, bucket: currentBucket() })); } catch (e) {}
    });
  }

  // Re-evaluate periodically so the theme flips automatically when the clock
  // crosses the day/night boundary (and stale overrides expire).
  setInterval(function () { applyTheme(resolveTheme()); }, 60000);

  var tx = 50;
  var ty = 18;
  var raf = null;
  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth) * 100;
    ty = (e.clientY / window.innerHeight) * 100;
    if (!raf) {
      raf = requestAnimationFrame(function () {
        document.body.style.setProperty('--mx', tx + '%');
        document.body.style.setProperty('--my', ty + '%');
        raf = null;
      });
    }
  }, { passive: true });

  var headers = [].slice.call(document.querySelectorAll('.section-header'));
  var lastY = window.pageYOffset || 0;

  function updateNav() {
    var y = window.pageYOffset || 0;
    document.body.classList.toggle('scrolled', y > 8);

    if (y > lastY && y > 140) document.body.classList.add('nav-hidden');
    else if (y < lastY - 4) document.body.classList.remove('nav-hidden');
    lastY = y;

    var stickyTop = document.body.classList.contains('nav-hidden') ? 0 : 80;
    var pinned = null;

    for (var i = 0; i < headers.length; i++) {
      var sec = headers[i].closest('.section');
      if (!sec) continue;
      var r = sec.getBoundingClientRect();
      if (r.top <= stickyTop + 1 && r.bottom > stickyTop + headers[i].offsetHeight) pinned = headers[i];
    }

    for (var j = 0; j < headers.length; j++) {
      headers[j].classList.toggle('pinned', headers[j] === pinned);
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('load', updateNav);
  window.addEventListener('hashchange', updateNav);
  updateNav();
  setTimeout(updateNav, 150);
  setTimeout(updateNav, 600);
})();
