(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.js-global-search').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      if (!value) {
        return;
      }
      event.preventDefault();
      window.location.href = 'library.html?q=' + encodeURIComponent(value);
    });
  });

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupCardFiltering(scope) {
    const grid = scope.querySelector('[data-card-grid]');
    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll('.movie-card'));
    const searchInput = scope.querySelector('.js-card-search');
    const yearSelect = scope.querySelector('.js-filter-year');
    const regionSelect = scope.querySelector('.js-filter-region');
    const typeSelect = scope.querySelector('.js-filter-type');
    const emptyState = scope.querySelector('[data-empty-state]');

    function applyFilter() {
      const keyword = normalize(searchInput ? searchInput.value : '');
      const year = normalize(yearSelect ? yearSelect.value : '');
      const region = normalize(regionSelect ? regionSelect.value : '');
      const type = normalize(typeSelect ? typeSelect.value : '');
      let visibleCount = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.textContent
        ].join(' '));
        const matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const matchesYear = !year || normalize(card.dataset.year) === year;
        const matchesRegion = !region || normalize(card.dataset.region) === region;
        const matchesType = !type || normalize(card.dataset.type) === type;
        const shouldShow = matchesKeyword && matchesYear && matchesRegion && matchesType;

        card.hidden = !shouldShow;
        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    [searchInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query && searchInput) {
      searchInput.value = query;
      applyFilter();
    }
  }

  document.querySelectorAll('main').forEach(setupCardFiltering);

  function setupHero(hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    if (slides.length <= 1) {
      return;
    }

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.dataset.heroDot || 0));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  document.querySelectorAll('[data-hero]').forEach(setupHero);
})();
