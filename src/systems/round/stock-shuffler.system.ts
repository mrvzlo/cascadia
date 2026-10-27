import GameWorld from "../../components/game-world";
import { HEX_SIZE, STOCK_SIZE } from "../../consts/sizes";
import { CreateGraphics } from "../hitboxes/create-hitboxes.system";
import { animateTileMove } from "../animations/tile-animation.system";
import { setGameStateToPickTile } from "./state-management.system";
import { shuffle } from "../generic/shuffle.system";
import { findModeCount } from "../generic/mode.system";

const DECK_Y = -HEX_SIZE * 2;
const animalResetIndexes = [0, 1, 2, 3];

export async function AddCenterTiles(gameWorld: GameWorld) {
  const allSame = () => findModeCount(gameWorld.center.animalStock.map((x) => x.value)) === STOCK_SIZE;
  await fillStock(gameWorld);
  while (allSame()) {
    await clearStock(gameWorld, [], animalResetIndexes);
    await fillStock(gameWorld);
  }

  setGameStateToPickTile(gameWorld);
}

function fillStock(world: GameWorld) {
  const filled = beforeFillStock(world);
  CreateGraphics(world);
  return Promise.all(animateStockAppearance(world, filled.tilesToAnimate, filled.animalsToAnimate));
}

export async function clearStock(world: GameWorld, tiles: number[], animals: number[]) {
  await Promise.all(animateStockClear(world, tiles, animals));
  afterClearStock(world, tiles, animals);
}

function beforeFillStock(world: GameWorld) {
  const tilesToAnimate: number[] = [];
  const animalsToAnimate: number[] = [];

  for (let i = 0; i < STOCK_SIZE; i++) {
    if (world.center.animalStock[i] === undefined) {
      const animal = world.center.animalShuffled.pop();
      if (animal === undefined) throw new Error("Animal deck is empty while filling the center stock.");
      world.center.animalStock[i] = { value: animal, id: world.idMngr.getNext("A") };
      animalsToAnimate.push(i);
    }
    if (world.center.tileStock[i] === undefined) {
      const tile = world.center.tileShuffled.pop();
      if (tile === undefined) throw new Error("Tile deck is empty while filling the center stock.");
      world.center.tileStock[i] = tile;
      tilesToAnimate.push(i);
    }
  }

  CreateGraphics(world);
  return { tilesToAnimate, animalsToAnimate };
}

function animateStockAppearance(world: GameWorld, tilesToAnimate: number[], animalsToAnimate: number[]) {
  const animations: Promise<void>[] = [];
  tilesToAnimate.forEach((x) => {
    const tile = world.center.tileStock[x]!;
    const hitbox = world.hitboxes.get(tile.hitboxId!)!;
    hitbox.graphics.position.set(hitbox.point.x, DECK_Y);
    animations.push(animateTileMove(hitbox, 500));
  });
  animalsToAnimate.forEach((x) => {
    const animal = world.center.animalStock[x]!;
    const hitbox = world.hitboxes.get(animal.hitboxId!)!;
    hitbox.graphics.position.set(hitbox.point.x, DECK_Y);
    animations.push(animateTileMove(hitbox, 500));
  });
  return animations;
}

function animateStockClear(world: GameWorld, tilesToRemove: number[], animalsToRemove: number[]) {
  const animations: Promise<void>[] = [];
  tilesToRemove.forEach((x) => {
    const tile = world.center.tileStock[x]!;
    const hitbox = world.hitboxes.get(tile.hitboxId!)!;
    hitbox.point = { x: hitbox.point.x, y: DECK_Y };
    animations.push(animateTileMove(hitbox, 500));
  });
  animalsToRemove.forEach((x) => {
    const animal = world.center.animalStock[x]!;
    const hitbox = world.hitboxes.get(animal.hitboxId!)!;
    hitbox.point = { x: hitbox.point.x, y: DECK_Y };
    animations.push(animateTileMove(hitbox, 500));
  });
  return animations;
}

function afterClearStock(world: GameWorld, tilesToRemove: number[], animalsToRemove: number[]) {
  tilesToRemove.forEach((x) => {
    const hitbox = world.hitboxes.get(world.center.tileStock[x].hitboxId!)!;
    delete world.center.tileStock[x];
    hitbox.graphics.clear();
    world.tileContainer.removeChild(hitbox.graphics);
  });
  animalsToRemove.forEach((x) => {
    const tile = world.center.animalStock[x];
    world.center.animalShuffled.push(tile.value);
    const hitbox = world.hitboxes.get(tile.hitboxId!)!;
    delete world.center.animalStock[x];
    hitbox.graphics.clear();
    world.animalContainer.removeChild(hitbox.graphics);
  });
  shuffle(world.center.animalShuffled);
}
