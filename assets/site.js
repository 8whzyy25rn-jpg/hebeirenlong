// Mobile navigation toggle. Everything else on this site works without JS.
(function () {
  var toggle = document.querySelector('.navtoggle');
  var nav = document.querySelector('nav.main');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Motion: header shadow and scroll reveals. Without JS everything stays visible.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('anim')) return;

  var masthead = document.querySelector('.masthead');
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (!('IntersectionObserver' in window)) {
    root.classList.remove('anim');
    return;
  }

  var selector = '.sechead, .index-table tbody tr, .facts > div, .shots figure, .docs figure, .family, .famindex li, .spec-list li';
  var items = [].slice.call(document.querySelectorAll(selector));
  var seen = new Map();

  items.forEach(function (el) {
    var parent = el.parentNode;
    var n = seen.get(parent) || 0;
    seen.set(parent, n + 1);
    if (n) el.style.setProperty('--rv-delay', Math.min(n, 5) * 60 + 'ms');
    el.classList.add('rv');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  items.forEach(function (el) { io.observe(el); });
})();
