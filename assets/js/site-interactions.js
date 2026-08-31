(function () {
  document.documentElement.classList.add("has-js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initNavbar() {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    const nodes = document.querySelectorAll(
      "[data-reveal], [data-reveal-stagger] > *, .news table tr, .publications ol.bibliography > li"
    );
    if (!nodes.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((el) => io.observe(el));
  }

  function initCardTilt() {
    if (reduceMotion || !finePointer) return;
    const max = 2.4;
    document.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("pointerenter", () => {
        card.classList.add("is-tilting");
      });
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-py * max).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(px * max).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function initMicroscope() {
    const root = document.querySelector("[data-ai-scope]");
    if (!root) return;
    const stage = root.querySelector(".ai-scope__stage");
    const surface = root.querySelector(".ai-scope__clip") || stage;
    const lens = root.querySelector(".ai-scope__lens");
    if (!stage || !lens) return;

    const park = (x, y) => {
      root.style.setProperty("--lens-x", `${x}%`);
      root.style.setProperty("--lens-y", `${y}%`);
    };

    park(62, 44);

    if (reduceMotion) {
      root.classList.add("is-static");
      return;
    }

    const move = (clientX, clientY) => {
      const rect = surface.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      park(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
    };

    surface.addEventListener("pointermove", (event) => {
      move(event.clientX, event.clientY);
    });
    surface.addEventListener("pointerdown", (event) => {
      surface.setPointerCapture(event.pointerId);
      move(event.clientX, event.clientY);
    });
    surface.addEventListener("pointerleave", () => {
      if (finePointer) park(62, 44);
    });
  }

  function initNameSwap() {
    const swap = document.querySelector("[data-name-swap]");
    if (!swap) return;
    swap.addEventListener("click", () => {
      swap.classList.toggle("is-flipped");
    });
  }

  onReady(() => {
    initNavbar();
    initReveal();
    initCardTilt();
    initMicroscope();
    initNameSwap();
  });
})();
