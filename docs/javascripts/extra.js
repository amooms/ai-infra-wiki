(() => {
  "use strict";

  const runtimeKey = "__baiyuanInfraEffects";
  document.documentElement.classList.add("by-js");

  let runtime = window[runtimeKey];

  if (!runtime) {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const glow = document.createElement("div");
    glow.className = "by-mouse-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    const state = {
      glow,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      frameId: 0,
      hasPosition: false
    };

    const animateGlow = () => {
      state.currentX += (state.targetX - state.currentX) * 0.15;
      state.currentY += (state.targetY - state.currentY) * 0.15;
      state.glow.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;

      const moving = Math.abs(state.targetX - state.currentX) > 0.1 || Math.abs(state.targetY - state.currentY) > 0.1;
      state.frameId = moving ? window.requestAnimationFrame(animateGlow) : 0;
    };

    const onPointerMove = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      if (!state.hasPosition) {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.hasPosition = true;
      }
      state.glow.classList.add("is-visible");
      if (!state.frameId) state.frameId = window.requestAnimationFrame(animateGlow);
    };

    const onPointerLeave = () => state.glow.classList.remove("is-visible");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave, { passive: true });

    runtime = state;
    window[runtimeKey] = runtime;
  }

  const initializePage = () => {
    const page = document.querySelector(".by-page");
    if (!page) return;

    const pageType = page.classList.contains("by-page--home")
      ? "home"
      : page.classList.contains("by-page--article")
        ? "article"
        : "category";
    document.body.dataset.byPageType = pageType;

    page.classList.remove("is-page-ready");
    if (pageType === "category") {
      page.querySelectorAll(".by-file-list a").forEach((row, index) => {
        row.style.setProperty("--by-row-delay", `${Math.min(index, 10) * 22}ms`);
      });
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => page.classList.add("is-page-ready"));
    });
  };

  if (!runtime.lifecycleBound) {
    runtime.lifecycleBound = true;
    if (typeof document$ !== "undefined") {
      document$.subscribe(initializePage);
    } else if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializePage, { once: true });
    } else {
      initializePage();
    }
  }
})();
