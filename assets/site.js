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
