/**
 * Vanilla 3D tilt on hover for [data-tilt] elements.
 * Pointer-position drives rotateX / rotateY of the card.
 * Children using transform: translateZ get free parallax.
 */

export function initTilt() {
  if (document.documentElement.classList.contains("reduce-motion")) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const els = document.querySelectorAll<HTMLElement>("[data-tilt]");
  els.forEach((el) => {
    const max = parseFloat(el.dataset.tiltMax || "8"); // degrees
    let raf: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const update = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el.style.transform = `perspective(900px) rotateX(${curY}deg) rotateY(${curX}deg)`;
      if (
        Math.abs(targetX - curX) > 0.05 ||
        Math.abs(targetY - curY) > 0.05
      ) {
        raf = requestAnimationFrame(update);
      } else {
        raf = null;
      }
    };

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = px * max;
      targetY = -py * max;
      if (raf === null) raf = requestAnimationFrame(update);
    });

    el.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      if (raf === null) raf = requestAnimationFrame(update);
    });
  });
}
