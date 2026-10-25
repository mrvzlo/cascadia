import Hitbox from "../../components/hitbox";
import { rotationToDeg } from "../render/hex-render.system";

const MOVE_DURATION = 200;

export function animateTileMove(hitbox: Hitbox, duration = MOVE_DURATION) {
  const graphic = hitbox.graphics;
  const start = graphic.position;
  const end = hitbox.point;

  const startTime = performance.now();
  return new Promise<void>((resolve) => {
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress * progress * (3 - 2 * progress);
      graphic.position.set(start.x + (end.x - start.x) * eased, start.y + (end.y - start.y) * eased);

      if (progress < 1) requestAnimationFrame(animate);
      else resolve();
    };

    requestAnimationFrame(animate);
  });
}

export function animateTileRotate(hitbox: Hitbox, to: number) {
  const graphic = hitbox.graphics;
  let fromDeg = graphic?.rotation;
  let toDeg = rotationToDeg(to);

  if (toDeg - fromDeg > Math.PI) fromDeg += Math.PI * 2;
  if (fromDeg - toDeg > Math.PI) fromDeg -= Math.PI * 2;

  const startTime = performance.now();
  return new Promise<void>((resolve) => {
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / MOVE_DURATION, 1);
      const eased = progress * progress * (3 - 2 * progress);
      graphic.rotation = fromDeg + (toDeg - fromDeg) * eased;
      if (progress < 1) requestAnimationFrame(animate);
      else resolve();
    };

    requestAnimationFrame(animate);
  });
}
