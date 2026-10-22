import { Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import { GameState } from "../../components/game-state";
import { redraw, redrawWithFadeIn, redrawWithFadeOut } from "../generic/base-animation.system";
import { AddCenterTiles } from "./round-shuffler.system";

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
  animateTileReplace(world, world.lastPickup.tileIndex, world.lastPickup.animalIndex);
}

async function animateTileReplace(world: GameWorld, tile: number, animal: number) {
  world.center.tileFading = tile;
  world.center.animalFading = animal;
  await redrawWithFadeOut(world);
  delete world.center.tileStock[tile];
  delete world.center.animalStock[animal];
  delete world.lastPickup;
  redraw(world);
  AddCenterTiles(world, false);
  await redrawWithFadeIn(world);

  delete world.center.tileFading;
  delete world.center.animalFading;
  const randomDelete = Math.floor(Math.random() * 4);
  world.center.tileFading = randomDelete;
  world.center.animalFading = randomDelete;
  await redrawWithFadeOut(world);
  delete world.center.tileStock[randomDelete];
  delete world.center.animalStock[randomDelete];
  redraw(world);
  AddCenterTiles(world);
  await redrawWithFadeIn(world);

  delete world.center.tileFading;
  delete world.center.animalFading;
  redraw(world);
}
