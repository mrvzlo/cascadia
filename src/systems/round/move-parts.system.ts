import GameWorld from "../../components/game-world";
import { animateTileMove } from "../animations/tile-move.system";
import { getTilePointOnPlayerBoard, getTilePointOnStock } from "../render/board-position.system";
import Hitbox from "../../components/hitbox";
import { GameElementType } from "../../consts/enums/game-element.type";
import { EdgeTile } from "../../components/edge-tile";
import { HexTile } from "../../components/hex-tile";
import { UpdateScore } from "../draw-board.system";
import { Coords } from "../../components/coords";
import { PlacedTile } from "../../components/placed-tile";
import {
  setGameStateToPlaceTile,
  setGameStateToPickAnimal,
  setGameStateToPlaceAnimal,
  setGameStateToPickTile,
} from "./state-management.system";

export function pickTile(world: GameWorld, stockTileHitbox: Hitbox) {
  const stockIndex = world.center.tileStock.findIndex((x) => x.id === stockTileHitbox.renderedOn);
  if (stockIndex < 0) return;

  const tile = world.center.tileStock[stockIndex]!;
  const animal = world.center.animalStock[stockIndex]!;
  world.lastPickup = { tile, tileIndex: stockIndex, animal, animalIndex: stockIndex, tileHitbox: stockTileHitbox };
  setGameStateToPlaceTile(world);
}

export async function placeTile(world: GameWorld, edgeHitbox: Hitbox) {
  const edgeTile = world.player.edges.getAll().find((x) => x.id === edgeHitbox.renderedOn)!;
  const pickup = world.lastPickup!;
  removeEdge(world, edgeTile, edgeHitbox);
  world.isWaiting = true;
  await moveTileFromStockToBoard(world, pickup.tileIndex, pickup.tile, edgeTile.coords, pickup.tileHitbox);
  setGameStateToPickAnimal(world);
  UpdateScore(world);
}

function removeEdge(world: GameWorld, edgeTile: EdgeTile, edgeHitbox: Hitbox) {
  world.player.edges.delete(edgeTile.id);
  edgeHitbox.graphics.clear();
  world.playerContainer.removeChild(edgeHitbox.graphics);
}

async function moveTileFromStockToBoard(world: GameWorld, index: number, tile: HexTile, coords: Coords, hitbox: Hitbox) {
  const newTileId = world.idMngr.getNext("P");
  world.player.tiles.set(coords, { ...tile, id: newTileId, hitboxId: hitbox.id, coords });
  hitbox.renderedOn = newTileId;
  hitbox.renderedType = GameElementType.BoardTile;
  hitbox.point = getTilePointOnPlayerBoard(world, coords);
  await animateTileMove(hitbox);
  delete world.center.tileStock[index];
}

async function moveTileFromBoardToStock(world: GameWorld, index: number, tile: PlacedTile, hitbox: Hitbox) {
  const newTileId = world.idMngr.getNext("S");
  world.center.tileStock[index] = { animals: tile.animals, bioms: tile.bioms, id: newTileId, hitboxId: hitbox.id };
  hitbox.renderedOn = newTileId;
  hitbox.renderedType = GameElementType.StockTile;
  hitbox.point = getTilePointOnStock(world, index, 0);
  await animateTileMove(hitbox);
  world.player.tiles.delete(tile.id);
}

export function pickAnimal(world: GameWorld, hitbox: Hitbox) {
  const stockIndex = world.center.animalStock.findIndex((x) => x.id === hitbox.renderedOn);
  if (stockIndex < 0) return;

  const animal = world.center.animalStock[stockIndex]!;
  world.lastPickup!.animal = animal;
  world.lastPickup!.animalHitbox = hitbox;
  world.lastPickup!.animalIndex = stockIndex;

  setGameStateToPlaceAnimal(world);
}

export async function placeAnimal(world: GameWorld, toPlaceHitbox: Hitbox) {
  const placementTile = world.player.tiles.getAll().find((x) => x.id === toPlaceHitbox.renderedOn)!;
  const pickup = world.lastPickup!;
  const animal = world.center.animalStock[pickup.animalIndex];

  world.isWaiting = true;
  placementTile.occupied = animal.value;
  pickup.animalHitbox!.point = getTilePointOnPlayerBoard(world, placementTile.coords);
  pickup.animalHitbox!.renderedOn = placementTile.id;
  pickup.animalHitbox!.renderedType = GameElementType.BoardAnimal;
  await animateTileMove(pickup.animalHitbox!);
  delete world.center.animalStock[pickup.animalIndex];

  setGameStateToPickTile(world);
  UpdateScore(world);

  /*
  const tile = world.player.tiles.get(coords)!;
  if (!tile.animals.includes(world.lastPickup.animal.value)) return;
  world.isWaiting = true;
  world.gameState = GameStateType.PickTile;
  delete world.center.animalStock[world.lastPickup.animalIndex];

  await animateAnimalPlacing(world, world.lastPickup, coords);
  tile.occupied = world.lastPickup!.animal.value;

  await animateStockDelete(world, world.lastPickup.tileIndex, world.lastPickup.animalIndex);
  await animateStockAdding(world);
  const randomDelete = Math.floor(Math.random() * 4);
  await animateStockDelete(world, randomDelete, randomDelete);
  await animateStockAdding(world);
  delete world.lastPickup;
  UpdateScore(world);*/
}
