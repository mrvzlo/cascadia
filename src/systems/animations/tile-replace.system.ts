import GameWorld from "../../components/game-world";
import { AddCenterTiles } from "../round/round-shuffler.system";
import { redraw, fadeTo, pause } from "./base-animation.system";

const FADE_DURATION = 200;
const FADE_PAUSE = 500;

export async function animateStockDelete(world: GameWorld, tile: number, animal: number) {
  world.center.tileFading = tile;
  world.center.animalFading = animal;
  redraw(world);
  await fadeTo(1, 0, world.fadingContainer, FADE_DURATION);
  delete world.center.tileStock[tile];
  delete world.center.animalStock[animal];
}

export async function animateStockAdding(world: GameWorld) {
  AddCenterTiles(world, false);
  redraw(world);
  await fadeTo(0, 1, world.fadingContainer, FADE_DURATION);
  delete world.center.tileFading;
  delete world.center.animalFading;
  await pause(FADE_PAUSE);
}
