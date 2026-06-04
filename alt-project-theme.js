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

  syncPressed();

  if (t) {
    t.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', isLight ? 'dark' : 'light'); } catch (e) {}
      syncPressed();
    });
  }

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
