(function () {
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  var root = document.documentElement;

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();
