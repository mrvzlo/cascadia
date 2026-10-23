import { Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import { GameState } from "../../components/game-state";
import { redraw } from "../animations/base-animation.system";
import { animateStockAdding, animateStockDelete } from "../animations/tile-replace.system";
import { animateTileMove } from "../animations/tile-move.system";
import { getTilePointOnPlayerBoard, getTilePointOnStock } from "../layout/board-position.system";
import Hitbox from "../../components/hitbox";
import Pickup from "../../components/pickup";

export function pickTile(world: GameWorld, id: number, hitbox: Hitbox) {
  if (world.gameState !== GameState.PickTile) return;
  const tile = world.center.tileStock[id]!;
  const animal = world.center.animalStock[id]!;
  world.lastPickup = { tile, tileIndex: id, animal, animalIndex: id, tileHitbox: hitbox };
  world.gameState++;
  redraw(world);
}

export async function placeTile(world: GameWorld, coords: Point) {
  if (world.gameState !== GameState.PlaceTile) return;

  const pickup = world.lastPickup!;
  world.isWaiting = true;
  delete world.center.tileStock[pickup.tileIndex];
  await animateTilePlacing(world, pickup, coords);
  world.player.tiles.set(coords, { ...pickup.tile, point: coords });
  world.gameState = GameState.PickAnimal;
  redraw(world);
}

async function animateTilePlacing(world: GameWorld, pickup: Pickup, coords: Point) {
  redraw(world);
  const from = getTilePointOnStock(world, pickup.tileIndex, 0);
  const to = getTilePointOnPlayerBoard(world, coords);
  await animateTileMove(world, pickup.tileHitbox, from, to);
}

export function pickAnimal(world: GameWorld, id: number, hitbox: Hitbox) {
  if (world.gameState !== GameState.PickAnimal) return;
  const animal = world.center.animalStock[id]!;
  world.lastPickup!.animal = animal;
  world.lastPickup!.animalHitbox = hitbox;
  world.lastPickup!.animalIndex = id;
  world.gameState++;
  redraw(world);
}

export async function placeAnimal(world: GameWorld, coords: Point) {
  if (world.gameState !== GameState.PlaceAnimal || !world.lastPickup) return;

  const tile = world.player.tiles.get(coords);
  if (!tile.animals.includes(world.lastPickup.animal)) return;
  world.isWaiting = true;
  world.gameState = GameState.PickTile;
  delete world.center.animalStock[world.lastPickup.animalIndex];

  await animateAnimalPlacing(world, world.lastPickup, coords);
  tile.occupied = world.lastPickup!.animal;

  await animateStockDelete(world, world.lastPickup.tileIndex, world.lastPickup.animalIndex);
  await animateStockAdding(world);
  const randomDelete = Math.floor(Math.random() * 4);
  await animateStockDelete(world, randomDelete, randomDelete);
  await animateStockAdding(world);
  delete world.lastPickup;
}

async function animateAnimalPlacing(world: GameWorld, pickup: Pickup, coords: Point) {
  redraw(world);
  const from = getTilePointOnStock(world, pickup.animalIndex, 1);
  const to = getTilePointOnPlayerBoard(world, coords);
  await animateTileMove(world, pickup.animalHitbox!, from, to);
}
