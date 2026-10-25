import { Graphics, PointData } from "pixi.js";
import GameWorld from "../../components/game-world";
import Hitbox from "../../components/hitbox";

const MOVE_DURATION = 200;

export function animateTileMove(world: GameWorld, hitbox: Hitbox, from: PointData, to: PointData) {
  hitbox.x = 0;
  hitbox.y = 0;
  const graphic = hitbox.onRender(hitbox);
  graphic.position.copyFrom(from);
  world.dragContainer.addChild(graphic);

  const startTime = performance.now();
  return new Promise<void>((resolve) => {
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / MOVE_DURATION, 1);
      const eased = progress * progress * (3 - 2 * progress);
      graphic.position.set(from.x + (to.x - from.x) * eased, from.y + (to.y - from.y) * eased);

      if (progress < 1) requestAnimationFrame(animate);
      else {
        world.dragContainer.removeChild(graphic);
        graphic.destroy();
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}
