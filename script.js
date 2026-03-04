(function () {
  // On load/refresh, always show the top of the page
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function goToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  goToTop();
  window.addEventListener("load", function () {
    goToTop();
    // Once more after load in case fonts/layout caused a shift
    requestAnimationFrame(function () { goToTop(); });
  });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) goToTop();
  });

  var trigger = document.querySelector(".menu-trigger");
  var nav = document.getElementById("nav");
  if (trigger && nav) {
    function open() {
      nav.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function close() {
      nav.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function toggle() {
      var isOpen = nav.getAttribute("aria-hidden") === "false";
      if (isOpen) close(); else open();
    }
    trigger.addEventListener("click", toggle);
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { close(); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("aria-hidden") === "false") close();
    });
  }

  // Email obfuscation: open mailto from data attributes (avoids plain address in HTML)
  var emailLink = document.querySelector(".contact-email");
  if (emailLink) {
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      var user = emailLink.getAttribute("data-user");
      var domain = emailLink.getAttribute("data-domain");
      if (user && domain) {
        window.location.href = "mailto:" + user + "\u0040" + domain;
      }
    });
  }

  // Gears: tap to add momentum, friction slows them down
  (function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var graphic = document.querySelector(".hero-graphic");
    var svg = document.querySelector(".gears-svg");
    var g1 = document.querySelector(".gear-1");
    var g2 = document.querySelector(".gear-2");
    var g3 = document.querySelector(".gear-3");
    if (!graphic || !svg || !g1 || !g2 || !g3) return;

    var positions = [
      [55, 72],
      [153, 72],
      [119, 135]
    ];
    var rotations = [0, 0, 0];
    var velocities = [0, 0, 0];
    var friction = 0.985;
    var tapBurst = 12;
    var idleSpin = [0.08, -0.06, 0.07]; // slow base spin per frame (gear 2 opposite)

    svg.classList.add("gears-momentum");

    function applyTransforms() {
      g1.style.transform = "translate(" + positions[0][0] + "px," + positions[0][1] + "px) rotate(" + rotations[0] + "deg)";
      g2.style.transform = "translate(" + positions[1][0] + "px," + positions[1][1] + "px) rotate(" + (-rotations[1]) + "deg)";
      g3.style.transform = "translate(" + positions[2][0] + "px," + positions[2][1] + "px) rotate(" + rotations[2] + "deg)";
    }

    graphic.addEventListener("click", function () {
      velocities[0] += tapBurst;
      velocities[1] += tapBurst;
      velocities[2] += tapBurst;
    });

    function tick() {
      for (var i = 0; i < 3; i++) {
        rotations[i] += idleSpin[i] + velocities[i];
        velocities[i] *= friction;
      }
      applyTransforms();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
})();
