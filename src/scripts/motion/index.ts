/**
 * Motion orchestrator — single entry point for all scroll/animation modules.
 * Loaded once from Layout.astro.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initLenis } from "./lenis";
import { initReveals } from "./reveal";
import { initParallax } from "./parallax";
import { initMarquees } from "./marquee";
import { initCursor } from "./cursor";
import { initTilt } from "./tilt";
import { initHeroPin } from "./pin-hero";

gsap.registerPlugin(ScrollTrigger);

function boot() {
  initLenis();
  initCursor();
  initMarquees();
  initReveals();
  initTilt();
  initHeroPin();
  initParallax();

  // Recalc on full load (fonts, images) so pinned/lined elements measure correctly
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
