(function () {
    var header = document.querySelector("[data-header]");

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 48) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    var mobileToggle = document.querySelector("[data-mobile-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input) {
                return;
            }
            var value = input.value.trim();
            if (!value) {
                return;
            }
            event.preventDefault();
            window.location.href = "./search.html?q=" + encodeURIComponent(value);
        });
    });

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5000);
        }

        var next = hero.querySelector("[data-hero-next]");
        var prev = hero.querySelector("[data-hero-prev]");

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    function filterCards(options) {
        var grid = document.querySelector("[data-card-grid]");
        if (!grid) {
            return;
        }
        var query = (options.query || "").toLowerCase();
        var category = options.category || "all";
        var field = options.field || "all";
        var value = options.value || "all";

        grid.querySelectorAll(".movie-card").forEach(function (card) {
            var text = (card.getAttribute("data-search") || "").toLowerCase();
            var matchesQuery = !query || text.indexOf(query) !== -1;
            var matchesCategory = category === "all" || card.getAttribute("data-category") === category;
            var matchesField = field === "all" || value === "all" || card.getAttribute("data-" + field) === value;
            card.classList.toggle("is-hidden", !(matchesQuery && matchesCategory && matchesField));
        });
    }

    var searchInput = document.querySelector("[data-live-search]");
    var categorySelect = document.querySelector("[data-category-select]");
    var clearSearch = document.querySelector("[data-clear-search]");

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        searchInput.value = initialQuery;

        function updateSearchPage() {
            filterCards({
                query: searchInput.value.trim(),
                category: categorySelect ? categorySelect.value : "all"
            });
        }

        searchInput.addEventListener("input", updateSearchPage);

        if (categorySelect) {
            categorySelect.addEventListener("change", updateSearchPage);
        }

        if (clearSearch) {
            clearSearch.addEventListener("click", function () {
                searchInput.value = "";
                if (categorySelect) {
                    categorySelect.value = "all";
                }
                updateSearchPage();
                history.replaceState(null, "", "./search.html");
            });
        }

        updateSearchPage();
    }

    var activeFilter = { field: "all", value: "all" };

    document.querySelectorAll("[data-filter-field]").forEach(function (button) {
        button.addEventListener("click", function () {
            document.querySelectorAll("[data-filter-field]").forEach(function (item) {
                item.classList.remove("is-active");
            });
            button.classList.add("is-active");
            activeFilter.field = button.getAttribute("data-filter-field") || "all";
            activeFilter.value = button.getAttribute("data-filter-value") || "all";
            filterCards(activeFilter);
        });
    });

    window.initVideoPlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var layer = document.querySelector(options.layerSelector);
        var playUrl = options.url;
        var attached = false;
        var hls = null;

        if (!video || !button || !playUrl) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = playUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(playUrl);
                hls.attachMedia(video);
            } else {
                video.src = playUrl;
            }
        }

        function start() {
            attach();
            if (layer) {
                layer.classList.add("is-hidden");
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (layer) {
                        layer.classList.remove("is-hidden");
                    }
                });
            }
        }

        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", function () {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (video.currentTime === 0 && layer) {
                layer.classList.remove("is-hidden");
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
