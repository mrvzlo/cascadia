import { Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import { GameState } from "../../components/game-state";
import { pause, redraw } from "../animations/base-animation.system";
import { animateStockAdding, animateStockDelete } from "../animations/tile-replace.system";

export function pickTile(world: GameWorld, id: number) {
  if (world.gameState !== GameState.PickTile) return;
  const tile = world.center.tileStock[id]!;
  const animal = world.center.animalStock[id]!;
  world.lastPickup = { tile, tileIndex: id, animal, animalIndex: id };
  world.gameState++;
  redraw(world);
}

export function placeTile(world: GameWorld, coords: Point) {
  if (world.gameState !== GameState.PlaceTile) return;

  world.player.tiles.set(coords, { ...world.lastPickup!.tile, point: coords });
  world.gameState++;
  redraw(world);
}

export function pickAnimal(world: GameWorld, id: number) {
  if (world.gameState !== GameState.PickAnimal) return;
  const animal = world.center.animalStock[id]!;
  world.lastPickup!.animal = animal;
  world.lastPickup!.animalIndex = id;
  world.gameState++;
  redraw(world);
}

export async function placeAnimal(world: GameWorld, coords: Point) {
  if (world.gameState !== GameState.PlaceAnimal || !world.lastPickup) return;

  const tile = world.player.tiles.get(coords);
  if (!tile.animals.includes(world.lastPickup.animal)) return;
  tile.occupied = world.lastPickup!.animal;
  world.gameState = GameState.Waiting;

  await animateStockDelete(world, world.lastPickup.tileIndex, world.lastPickup.animalIndex);
  await animateStockAdding(world);
  const randomDelete = Math.floor(Math.random() * 4);
  await animateStockDelete(world, randomDelete, randomDelete);
  await animateStockAdding(world);
  delete world.lastPickup;
  world.gameState = GameState.PickTile;
}
