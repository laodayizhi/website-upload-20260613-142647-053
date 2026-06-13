(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMobileMenu() {
        var button = document.querySelector(".mobile-menu-button");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }

        button.addEventListener("click", function () {
            var expanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
        var prev = carousel.querySelector(".hero-prev");
        var next = carousel.querySelector(".hero-next");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.dataset.slide || 0));
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function cardTemplate(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");

        return [
            "<article class=\"movie-card\">",
            "<a class=\"poster-link\" href=\"" + escapeHtml(movie.href) + "\" aria-label=\"观看" + escapeHtml(movie.title) + "\">",
            "<img src=\"" + escapeHtml(movie.poster) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
            "<span class=\"poster-gradient\"></span>",
            "<span class=\"card-play\">▶</span>",
            "<span class=\"card-duration\">" + escapeHtml(movie.duration) + "</span>",
            "</a>",
            "<div class=\"card-body\">",
            "<div class=\"card-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.region) + "</span></div>",
            "<h3><a href=\"" + escapeHtml(movie.href) + "\">" + escapeHtml(movie.title) + "</a></h3>",
            "<p>" + escapeHtml(movie.one_line) + "</p>",
            "<div class=\"tag-row\">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function setupSearchPage() {
        var container = document.getElementById("searchResults");
        if (!container || !window.MOVIE_INDEX) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var input = document.getElementById("searchInput");
        var title = document.getElementById("searchTitle");
        var query = (params.get("q") || "").trim();

        if (input) {
            input.value = query;
        }

        function render(keyword) {
            var normalized = keyword.trim().toLowerCase();
            var results = window.MOVIE_INDEX.filter(function (movie) {
                if (!normalized) {
                    return true;
                }
                var haystack = [
                    movie.title,
                    movie.region,
                    movie.type,
                    movie.year,
                    movie.genre,
                    movie.one_line,
                    (movie.tags || []).join(" ")
                ].join(" ").toLowerCase();
                return haystack.indexOf(normalized) !== -1;
            }).slice(0, 240);

            if (title) {
                title.textContent = normalized ? "“" + keyword + "” 的搜索结果" : "全部可筛选影片";
            }

            if (!results.length) {
                container.innerHTML = "<div class=\"story-card\"><p>没有找到匹配影片，可以更换关键词继续搜索。</p></div>";
                return;
            }

            container.innerHTML = results.map(cardTemplate).join("");
        }

        var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var value = button.getAttribute("data-filter") || "";
                if (input) {
                    input.value = value;
                }
                var url = new URL(window.location.href);
                url.searchParams.set("q", value);
                window.history.replaceState({}, "", url.toString());
                render(value);
            });
        });

        render(query);
    }

    ready(function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupSearchPage();
    });
}());
