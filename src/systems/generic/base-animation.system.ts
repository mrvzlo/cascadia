import { Container } from "pixi.js";
import GameWorld from "../../components/game-world";
import { DrawBoard } from "../layout/draw-board.system";

const FADE_DURATION = 300;

export function fadeTo(alpha: number, container: Container, duration: number) {
  const startingAlpha = container.alpha;
  const startTime = performance.now();

  return new Promise<void>((resolve) => {
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      container.alpha = startingAlpha + (alpha - startingAlpha) * progress;

      if (progress < 1) requestAnimationFrame(animate);
      else resolve();
    };

    requestAnimationFrame(animate);
  });
}

export function pause(duration: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

export async function redrawWithFadeIn(world: GameWorld) {
  world.fadingContainer.alpha = 0;
  redraw(world);
  await fadeTo(1, world.fadingContainer, FADE_DURATION);
}

export async function redrawWithFadeOut(world: GameWorld) {
  world.fadingContainer.alpha = 1;
  redraw(world);
  await fadeTo(0, world.fadingContainer, FADE_DURATION);
}

export function fadeOut(world: GameWorld) {
  return fadeTo(0, world.fadingContainer, FADE_DURATION);
}

export function redraw(world: GameWorld) {
  world.fadingContainer.removeChildren().forEach((child) => child.destroy());
  world.playerContainer.removeChildren().forEach((child) => child.destroy());
  world.topContainer.removeChildren().forEach((child) => child.destroy());
  world.scoreContainer.removeChildren().forEach((child) => child.destroy());
  DrawBoard(world);
}
