(function () {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('is-active', idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('is-active', idx === current);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            play();
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        showSlide(0);
        play();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function findScope(control) {
        var section = control.closest('.content-section') || document;
        return section.querySelector('[data-search-scope]') || document.querySelector('[data-search-scope]');
    }

    function filterScope(input) {
        var scope = findScope(input);
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.children);
        var keyword = normalize(input.value);
        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-type'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' '));
            card.classList.toggle('is-hidden-by-search', keyword && text.indexOf(keyword) === -1);
        });
    }

    var query = new URLSearchParams(window.location.search).get('q') || '';
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-live-search]'));
    inputs.forEach(function (input) {
        if (query && input.hasAttribute('data-query-input')) {
            input.value = query;
        }
        if (query && !input.value && document.body.contains(input)) {
            input.value = query;
        }
        filterScope(input);
        input.addEventListener('input', function () {
            filterScope(input);
        });
    });

    var filterRows = Array.prototype.slice.call(document.querySelectorAll('[data-filter-row]'));
    filterRows.forEach(function (row) {
        var buttons = Array.prototype.slice.call(row.querySelectorAll('[data-filter-value]'));
        var scope = findScope(row);
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.children);
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var value = button.getAttribute('data-filter-value');
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                cards.forEach(function (card) {
                    var match = value === 'all' || card.getAttribute('data-year') === value;
                    card.classList.toggle('is-hidden-by-filter', !match);
                });
            });
        });
    });
})();
