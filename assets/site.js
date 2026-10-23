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

  var selector = '.facts > div, .shots figure, .docs figure, .family, .range-card';
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

// Hero banner: crossfade between three photos, refresh the text block.
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;

  var slides = [].slice.call(hero.querySelectorAll('.hero-media img'));
  var dots = [].slice.call(hero.querySelectorAll('.hero-dots button'));
  var wrap = hero.querySelector('.wrap');
  if (slides.length < 2) return;

  var index = 0;
  var timer = null;
  // Load the other two slides after the first paint.
  window.addEventListener('load', function () {
    slides.forEach(function (img) {
      if (!img.src && img.dataset.src) img.src = img.dataset.src;
    });
  });

  function show(n) {
    slides[index].classList.remove('is-on');
    if (dots[index]) dots[index].classList.remove('is-on');
    index = (n + slides.length) % slides.length;
    slides[index].classList.add('is-on');
    if (dots[index]) dots[index].classList.add('is-on');
    if (wrap) {
      wrap.classList.remove('swap');
      void wrap.offsetWidth;
      wrap.classList.add('swap');
    }
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function play() {
    stop();
    timer = setInterval(function () { show(index + 1); }, 3500);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i); play(); });
  });

  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', play);
  play();
})();

// Product carousel: horizontal snap list with arrows and dots.
(function () {
  var range = document.querySelector('.range');
  if (!range) return;

  var cards = [].slice.call(range.querySelectorAll('.range-card'));
  var prev = document.querySelector('.range-prev');
  var next = document.querySelector('.range-next');
  var dotsWrap = document.querySelector('.range-dots');
  if (!cards.length || !prev || !next || !dotsWrap) return;

  function step() {
    var gap = parseFloat(getComputedStyle(range).columnGap) || 30;
    return cards[0].getBoundingClientRect().width + gap;
  }

  var dots = cards.map(function (card, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to product ' + (i + 1));
    dot.addEventListener('click', function () {
      range.scrollTo({ left: step() * i, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function update() {
    var i = Math.round(range.scrollLeft / step());
    dots.forEach(function (dot, j) { dot.classList.toggle('is-on', j === i); });
    prev.disabled = range.scrollLeft <= 2;
    next.disabled = range.scrollLeft >= range.scrollWidth - range.clientWidth - 2;
  }

  prev.addEventListener('click', function () { range.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { range.scrollBy({ left: step(), behavior: 'smooth' }); });
  range.addEventListener('scroll', update, { passive: true });
  update();
})();
