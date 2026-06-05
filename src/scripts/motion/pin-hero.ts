/**
 * Hero pin & scrub: keeps the hero in place for ~1 viewport while the
 * title drifts and fades, giving a cinematic intro before scroll continues.
 * Disabled on mobile and reduce-motion.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initHeroPin() {
  if (document.documentElement.classList.contains("reduce-motion")) return;
  if (window.matchMedia("(max-width: 768px)").matches) return;

  const hero = document.querySelector<HTMLElement>("#inicio");
  if (!hero) return;

  const h1 = hero.querySelector<HTMLElement>("h1");
  const sub = hero.querySelector<HTMLElement>("[data-hero='sub']");
  const aside = hero.querySelector<HTMLElement>("[data-hero='aside']");
  const ambient = hero.querySelector<HTMLElement>(".hero-ambient");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=80%",
      scrub: 0.6,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  if (h1) tl.to(h1, { yPercent: -8, xPercent: 2, rotate: -1.2, ease: "none" }, 0);
  if (sub) tl.to(sub, { yPercent: -20, opacity: 0.3, ease: "none" }, 0);
  if (aside) tl.to(aside, { yPercent: -15, ease: "none" }, 0);
  if (ambient) tl.to(ambient, { opacity: 0, scale: 1.15, ease: "none" }, 0);
}
