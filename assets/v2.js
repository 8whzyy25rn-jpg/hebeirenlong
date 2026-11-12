(function () {
  var root = document.documentElement;
  var body = document.body;

  window.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(function () {
      body.classList.add("loaded");
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    var items = [].slice.call(document.querySelectorAll(".v2-reveal"));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (!reduceMotion && root.matches && root.matches("(pointer:fine)")) {
    var hero = document.querySelector(".v2-hero");
    var heroImage = document.querySelector(".v2-hero-media img");
    if (hero && heroImage) {
      hero.addEventListener("pointermove", function (event) {
        var bounds = hero.getBoundingClientRect();
        var x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
        var y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
        heroImage.style.transform = "scale(1.035) translate(" + x + "px," + y + "px)";
      });
      hero.addEventListener("pointerleave", function () {
        heroImage.style.transform = "";
      });
    }
  }

})();
