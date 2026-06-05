/**
 * Lenis smooth scroll bound to GSAP's ticker so ScrollTrigger stays in sync.
 */

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  const reduced = document.documentElement.classList.contains("reduce-motion");

  lenis = new Lenis({
    duration: reduced ? 0 : 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduced,
    syncTouch: false,
  });

  gsap.ticker.add((time) => {
    lenis!.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  lenis.on("scroll", ScrollTrigger.update);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
