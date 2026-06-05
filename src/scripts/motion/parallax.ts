/**
 * Parallax directive: [data-parallax="0.3"] applies translateY scrubbed to scroll.
 * Negative values move opposite to scroll direction.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initParallax() {
  if (document.documentElement.classList.contains("reduce-motion")) return;

  const els = document.querySelectorAll<HTMLElement>("[data-parallax]");
  els.forEach((el) => {
    const factor = parseFloat(el.dataset.parallax || "0.2");
    if (!factor) return;

    gsap.to(el, {
      yPercent: factor * 30, // ±30% over the trigger's distance
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
