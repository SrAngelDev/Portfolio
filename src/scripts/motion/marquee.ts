/**
 * Marquee: infinite horizontal scroller for [data-marquee] elements.
 * Duplicates the inner track once for seamless looping.
 *
 *   <div class="marquee" data-marquee data-marquee-speed="40" data-marquee-direction="left">
 *     <div class="marquee__track">
 *       <span class="marquee__item">React</span> ...
 *     </div>
 *   </div>
 */

import { gsap } from "gsap";

export function initMarquees() {
  const reduced = document.documentElement.classList.contains("reduce-motion");
  const marquees = document.querySelectorAll<HTMLElement>("[data-marquee]");

  marquees.forEach((root) => {
    const track = root.querySelector<HTMLElement>(".marquee__track");
    if (!track) return;

    // Duplicate track for seamless loop
    const clone = track.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    root.appendChild(clone);

    if (reduced) return;

    const speed = parseFloat(root.dataset.marqueeSpeed || "40"); // seconds per loop
    const direction = root.dataset.marqueeDirection === "right" ? 1 : -1;

    const tween = gsap.to([track, clone], {
      xPercent: direction * -100,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    // Pause on hover (subtle, doesn't fully stop)
    root.addEventListener("mouseenter", () => gsap.to(tween, { timeScale: 0.3, duration: 0.4 }));
    root.addEventListener("mouseleave", () => gsap.to(tween, { timeScale: 1, duration: 0.4 }));
  });
}
