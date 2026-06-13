function initMoviePlayer(streamUrl, videoId, buttonId) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    let attached = false;
    let hlsInstance = null;

    function attachStream() {
        if (attached || !video) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }

        attached = true;
    }

    function startPlayback() {
        if (!video) {
            return;
        }

        attachStream();

        if (button) {
            button.classList.add("is-hidden");
        }

        video.controls = true;
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                if (button) {
                    button.classList.remove("is-hidden");
                }
            });
        }
    }

    if (button) {
        button.addEventListener("click", startPlayback);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
    }

    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero-slider]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
        let current = 0;

        function showSlide(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide((current + 1) % slides.length);
            }, 5600);
        }
    }

    document.querySelectorAll(".content-section").forEach(function (section) {
        const searchInput = section.querySelector("[data-filter-search]");
        const yearSelect = section.querySelector("[data-filter-year]");
        const grid = section.querySelector("[data-filter-grid]");

        if (!grid || (!searchInput && !yearSelect)) {
            return;
        }

        const cards = Array.from(grid.querySelectorAll(".movie-card"));
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "没有找到匹配的影片";
        grid.insertAdjacentElement("afterend", empty);

        function applyFilters() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const text = (card.dataset.search || "").toLowerCase();
                const cardYear = card.dataset.year || "";
                const matched = (!query || text.includes(query)) && (!year || cardYear === year);
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            empty.classList.toggle("is-visible", visible === 0);
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilters);
        }
    });
});
