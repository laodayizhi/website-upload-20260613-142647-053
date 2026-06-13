(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function activate(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        activate(index);
      });
    });

    window.setInterval(function () {
      activate(current + 1);
    }, 5200);
  }

  var roots = Array.prototype.slice.call(document.querySelectorAll("[data-search-root]"));

  roots.forEach(function (root) {
    var input = root.querySelector("#site-search");
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
    var filters = Array.prototype.slice.call(root.querySelectorAll("[data-filter]"));
    var activeFilter = "all";

    function applyFilters() {
      var keyword = input ? input.value.trim().toLowerCase() : "";

      cards.forEach(function (card) {
        var text = (card.innerText + " " + card.getAttribute("data-title") + " " + card.getAttribute("data-meta")).toLowerCase();
        var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
        var filterMatch = activeFilter === "all" || text.indexOf(activeFilter.toLowerCase()) !== -1;
        card.classList.toggle("is-hidden-card", !(keywordMatch && filterMatch));
      });
    }

    if (input) {
      input.addEventListener("input", applyFilters);
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter") || "all";
        filters.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        applyFilters();
      });
    });
  });
})();
