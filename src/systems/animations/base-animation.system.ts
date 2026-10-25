import { Container } from "pixi.js";

export function fadeTo(fromA: number, toA: number, container: Container, duration: number) {
  const startTime = performance.now();

  return new Promise<void>((resolve) => {
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      container.alpha = fromA * (1 - progress) + toA * progress;

      if (progress < 1) requestAnimationFrame(animate);
      else resolve();
    };

    requestAnimationFrame(animate);
  });
}

export function pause(duration: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}
