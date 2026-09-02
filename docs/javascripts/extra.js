(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  function setupHomeGlow() {
    const home = document.querySelector(".infra-home");
    if (!home || reducedMotion.matches || !finePointer.matches || home.dataset.glowReady === "true") return;
    home.dataset.glowReady = "true";
    home.addEventListener("pointermove", (event) => {
      const rect = home.getBoundingClientRect();
      home.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      home.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
  }
  if (typeof document$ !== "undefined") document$.subscribe(setupHomeGlow);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupHomeGlow, { once: true });
  else setupHomeGlow();
})();
