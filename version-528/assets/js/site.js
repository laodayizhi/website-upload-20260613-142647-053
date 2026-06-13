(function () {
  var navButton = document.querySelector("[data-nav-toggle]");
  var navLinks = document.querySelector("[data-nav-links]");

  if (navButton && navLinks) {
    navButton.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var clearButton = document.querySelector("[data-clear-search]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var activeFilter = "all";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilters() {
    var query = normalize(searchInput ? searchInput.value : "");

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-filter-text"));
      var category = normalize(card.getAttribute("data-category"));
      var type = normalize(card.getAttribute("data-type"));
      var region = normalize(card.getAttribute("data-region"));
      var filter = normalize(activeFilter);
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesFilter = filter === "all" || category === filter || type.indexOf(filter) !== -1 || region.indexOf(filter) !== -1 || text.indexOf(filter) !== -1;

      card.classList.toggle("is-hidden", !(matchesQuery && matchesFilter));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (clearButton && searchInput) {
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      applyFilters();
      searchInput.focus();
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter-value") || "all";

      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });

      applyFilters();
    });
  });

  var video = document.querySelector("[data-player-video]");
  var playButton = document.querySelector("[data-play-button]");

  if (video) {
    var sourceNode = video.querySelector("source");
    var videoUrl = sourceNode ? sourceNode.getAttribute("src") : video.getAttribute("src");
    var shell = video.closest(".player-shell");

    function attachStream() {
      if (!videoUrl) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      }
    }

    function playVideo() {
      attachStream();
      var request = video.play();

      if (request && typeof request.catch === "function") {
        request.catch(function () {});
      }
    }

    if (playButton) {
      playButton.addEventListener("click", playVideo);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("is-playing");
      }
    });

    video.addEventListener("pause", function () {
      if (shell) {
        shell.classList.remove("is-playing");
      }
    });

    attachStream();
  }
})();
