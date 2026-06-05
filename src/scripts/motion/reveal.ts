/**
 * Reveal directive: scans the DOM for [data-reveal] and creates ScrollTriggers.
 *
 * Variants (data-reveal):
 *   up      → y: 40 → 0, opacity 0 → 1
 *   mask    → clip-path inset(0 0 100% 0) → inset(0)
 *   chars   → SplitText chars + y: 110% → 0 (per-char stagger)
 *   words   → SplitText words + y: 110% → 0 (per-word stagger)
 *   lines   → SplitText lines + y: 100% → 0 (per-line stagger)
 *   scale   → scale 0.92 → 1 + opacity 0 → 1
 *   fade    → opacity 0 → 1
 *
 * Optional attributes:
 *   data-reveal-delay="0.2"
 *   data-reveal-stagger="0.04"
 *   data-reveal-start="top 85%"
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitChars, splitWords, splitLines } from "./split";

export function initReveals() {
  if (document.documentElement.classList.contains("reduce-motion")) {
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  els.forEach((el) => buildReveal(el));
}

function buildReveal(el: HTMLElement) {
  const variant = el.dataset.reveal || "up";
  const delay = parseFloat(el.dataset.revealDelay || "0");
  const customStagger = el.dataset.revealStagger
    ? parseFloat(el.dataset.revealStagger)
    : null;
  const start = el.dataset.revealStart || "top 85%";

  let targets: HTMLElement[] | HTMLElement = el;
  let fromVars: gsap.TweenVars = {};
  let stagger = 0;

  switch (variant) {
    case "chars": {
      targets = splitChars(el);
      fromVars = { yPercent: 110, opacity: 0, rotate: 4 };
      stagger = customStagger ?? 0.022;
      // Reveal wrapper now (chars handle visibility individually)
      el.classList.add("is-revealed");
      break;
    }
    case "words": {
      targets = splitWords(el);
      fromVars = { yPercent: 110, opacity: 0 };
      stagger = customStagger ?? 0.06;
      el.classList.add("is-revealed");
      break;
    }
    case "lines": {
      // Lines require layout, so wait one frame
      requestAnimationFrame(() => {
        const lines = splitLines(el);
        el.classList.add("is-revealed");
        gsap.set(lines, { yPercent: 100, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => {
            gsap.to(lines, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: customStagger ?? 0.1,
              delay,
            });
          },
        });
      });
      return;
    }
    case "mask": {
      gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          el.classList.add("is-revealed");
          gsap.to(el, {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power3.out",
            delay,
          });
        },
      });
      return;
    }
    case "scale": {
      fromVars = { scale: 0.92, opacity: 0, transformOrigin: "50% 50%" };
      break;
    }
    case "fade": {
      fromVars = { opacity: 0 };
      break;
    }
    case "up":
    default: {
      fromVars = { y: 40, opacity: 0 };
    }
  }

  gsap.set(targets, fromVars);

  ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => {
      el.classList.add("is-revealed");
      gsap.to(targets, {
        y: 0,
        yPercent: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        delay,
      });
    },
  });
}
