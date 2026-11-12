(function () {
  function isInitiallyVisible(section) {
    var rect = section.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom <= 0 || rect.top >= viewportHeight) return false;

    var visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    return visibleHeight > 0;
  }

  function initRevealMotion(options) {
    var config = Object.assign(
      {
        root: document,
        sectionSelector: "[data-motion='section']",
        itemSelector: "[data-motion-item]",
        baseDelay: 80,
        stepDelay: 45,
        threshold: 0,
        rootMargin: "0px 0px -6% 0px",
      },
      options || {},
    );

    var root = config.root || document;
    var sections = Array.from(root.querySelectorAll(config.sectionSelector));
    if (!sections.length) return;

    document.body.classList.add("motion-enabled");

    sections.forEach(function (section) {
      section.classList.add("motion-bound");

      var items = section.querySelectorAll(config.itemSelector);
      items.forEach(function (item, idx) {
        item.setAttribute("data-motion-item", "");
        item.classList.add("motion-item");
        item.style.setProperty("--item-delay", config.baseDelay + idx * config.stepDelay + "ms");
      });
    });

    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (section) {
        section.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin,
      },
    );

    sections.forEach(function (section) {
      if (section.classList.contains("is-visible")) return;

      if (isInitiallyVisible(section)) {
        section.classList.add("is-visible");
        return;
      }

      observer.observe(section);
    });
  }

  window.initRevealMotion = initRevealMotion;
})();
