(function () {
    function initHeroSlider() {
        var slider = document.querySelector('.hero-slider');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-slide-index')) || 0;
                show(index);
                start();
            });
        });

        show(0);
        start();
    }

    function initFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
        inputs.forEach(function (input) {
            var scope = input.closest('[data-filter-scope]') || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-text]'));
            input.addEventListener('input', function () {
                var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute('data-search-text') || card.textContent || '').toLowerCase();
                    var matched = words.every(function (word) {
                        return haystack.indexOf(word) !== -1;
                    });
                    card.classList.toggle('is-hidden', !matched);
                });
            });
        });
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));
        players.forEach(function (video) {
            var shell = video.closest('.player-shell');
            var button = shell ? shell.querySelector('.play-cover') : null;
            var url = video.getAttribute('data-video-url');
            var loaded = false;

            function loadAndPlay() {
                if (!url) {
                    return;
                }
                if (!loaded) {
                    if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({ enableWorker: true });
                        hls.loadSource(url);
                        hls.attachMedia(video);
                    } else {
                        video.src = url;
                    }
                    loaded = true;
                }
                if (shell) {
                    shell.classList.add('is-playing');
                }
                var playResult = video.play();
                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function () {
                        video.controls = true;
                    });
                }
            }

            if (button) {
                button.addEventListener('click', loadAndPlay);
            }
            video.addEventListener('play', function () {
                if (shell) {
                    shell.classList.add('is-playing');
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHeroSlider();
        initFilters();
        initPlayers();
    });
}());
