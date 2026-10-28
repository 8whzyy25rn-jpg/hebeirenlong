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

  var form = document.getElementById("rfq-form");
  if (form) {
    function formData() {
      var data = new FormData(form);
      var subject = "Quotation request - " + (data.get("product") || "Piping components") + " - " + data.get("company");
      var lines = [
        "Name: " + data.get("name"),
        "Company: " + data.get("company"),
        "Email / WhatsApp: " + data.get("email"),
        "Country: " + data.get("country"),
        "Product family: " + (data.get("product") || "Not selected"),
        "Destination port: " + (data.get("destination") || "Not supplied"),
        "",
        "Requirement:",
        data.get("message")
      ];
      return { subject: subject, text: lines.join("\n") };
    }

    function validate() {
      var status = form.querySelector(".v2-form-status");
      var required = [].slice.call(form.querySelectorAll("[required]"));
      var firstEmpty = required.find(function (field) {
        return !field.value.trim();
      });

      if (!firstEmpty) return true;
      firstEmpty.focus();
      status.textContent = "Please complete the required fields.";
      status.classList.add("visible");
      return false;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".v2-form-status");
      if (!validate()) return;
      var inquiry = formData();
      status.textContent = "WhatsApp is opening with the inquiry prepared.";
      status.classList.add("visible");
      window.location.href = "https://wa.me/8613513483281?text=" + encodeURIComponent(inquiry.text);
    });

    var emailButton = document.getElementById("rfq-email");
    if (emailButton) {
      emailButton.addEventListener("click", function () {
        var status = form.querySelector(".v2-form-status");
        if (!validate()) return;
        var inquiry = formData();
        status.textContent = "Your email app is opening with the inquiry prepared.";
        status.classList.add("visible");
        window.location.href = "mailto:renlongguandao@zohomail.cn?subject=" +
          encodeURIComponent(inquiry.subject) +
          "&body=" +
          encodeURIComponent(inquiry.text);
      });
    }
  }
})();
