/* ==========================================================================
   Failsafe Auto-Scroll for Recording
   ========================================================================== */

(function () {
  // Prevent browser from restoring old scroll position on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function initScroll() {
    window.scrollTo(0, 0);

    // Wait 3.5 seconds to ensure preloader is completely gone
    setTimeout(() => {
      // Force unlock any overflow locks on body or html
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
      document.documentElement.style.overflow = "visible";
      document.body.classList.remove("is-loading");

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }

      const speed = 2; // Adjust scroll speed (higher = faster)

      function autoScrollStep() {
        const totalHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
        const currentPos = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        if (currentPos + windowHeight < totalHeight - 9) {
          window.scrollBy(0, speed);
          requestAnimationFrame(autoScrollStep);
        }
      }

      requestAnimationFrame(autoScrollStep);
    }, 3500);
  }

  if (document.readyState === "complete") {
    initScroll();
  } else {
    window.addEventListener("load", initScroll);
  }
})();
