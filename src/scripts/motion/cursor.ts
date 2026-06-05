/**
 * Magnetic custom cursor.
 * Dot follows the mouse 1:1, ring follows with lag (lerp).
 * Hover state on [data-cursor="hover"] / [data-cursor="text"].
 */

import { gsap } from "gsap";

export function initCursor() {
  if (document.documentElement.classList.contains("reduce-motion")) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.querySelector<HTMLElement>(".cursor-dot");
  const ring = document.querySelector<HTMLElement>(".cursor-ring");
  if (!dot || !ring) return;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: mouse.x, y: mouse.y };

  document.documentElement.classList.add("cursor-ready");

  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    },
    { passive: true }
  );

  // Lag the ring via RAF lerp
  gsap.ticker.add(() => {
    ringPos.x += (mouse.x - ringPos.x) * 0.18;
    ringPos.y += (mouse.y - ringPos.y) * 0.18;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  // Hover state
  const hoverTargets = "a, button, [data-cursor='hover'], [data-cursor=hover]";
  const textTargets = "[data-cursor='text'], [data-cursor=text]";

  document.addEventListener("mouseover", (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    if (t.closest(textTargets)) {
      ring.classList.add("is-text");
      ring.classList.remove("is-hover");
    } else if (t.closest(hoverTargets)) {
      ring.classList.add("is-hover");
      ring.classList.remove("is-text");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    if (t.closest(hoverTargets) || t.closest(textTargets)) {
      ring.classList.remove("is-hover", "is-text");
    }
  });

  // Hide when leaving viewport
  document.addEventListener("mouseleave", () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener("mouseenter", () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
}
