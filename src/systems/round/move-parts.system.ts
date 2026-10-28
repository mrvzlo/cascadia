import GameWorld from "../../components/game-world";
import { animateTileMove } from "../animations/tile-animation.system";
import { getTilePointOnPlayerBoard, getTilePointOnStock } from "../render/board-position.system";
import Hitbox from "../../components/hitbox";
import { GameElementType } from "../../consts/enums/game-element.type";
import { EdgeTile } from "../../components/edge-tile";
import { HexTile } from "../../components/hex-tile";
import { UpdateBoard, UpdateScore } from "../draw-board.system";
import { Coords } from "../../components/coords";
import { PlacedTile } from "../../components/placed-tile";
import {
  setGameStateToPlaceTile,
  setGameStateToPickAnimal,
  setGameStateToPlaceAnimal,
  setGameStateToPickTile,
} from "./state-management.system";
import { AddCenterTiles, clearStock } from "./stock-shuffler.system";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";
import { GameStateType } from "../../consts/enums/game-state.type";

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
  UpdateBoard(world);
  setGameStateToPickAnimal(world);
}

function removeEdge(world: GameWorld, edgeTile: EdgeTile, edgeHitbox: Hitbox) {
  world.player.edges.delete(edgeTile.id);
  edgeHitbox.graphics.clear();
  world.animalContainer.removeChild(edgeHitbox.graphics);
}

async function moveTileFromStockToBoard(world: GameWorld, index: number, tile: HexTile, coords: Coords, hitbox: Hitbox) {
  const newTileId = world.idMngr.getNext("P");
  world.player.tiles.set(coords, { ...tile, id: newTileId, hitboxId: hitbox.id, coords, occupied: TilePairType.Empty });
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
  if (!placementTile.animals.includes(animal.value)) return false;

  world.isWaiting = true;
  setGameStateToPickTile(world);
  placementTile.occupied = animal.value;
  pickup.animalHitbox!.point = getTilePointOnPlayerBoard(world, placementTile.coords);
  pickup.animalHitbox!.renderedOn = placementTile.id;
  pickup.animalHitbox!.renderedType = GameElementType.BoardAnimal;
  await animateTileMove(pickup.animalHitbox!);
  delete world.center.animalStock[pickup.animalIndex];
  if (placementTile.animals.length === 1) world.player.bonusScore++;

  await endRound(world);
  return true;
}

export async function removeAnimal(world: GameWorld) {
  world.isWaiting = true;
  const pickup = world.lastPickup!;
  setGameStateToPickTile(world);
  await clearStock(world, [], [pickup.animalIndex]);
  await endRound(world);
}

async function endRound(world: GameWorld) {
  UpdateScore(world);
  await AddCenterTiles(world);
  const randomDelete = Math.floor(Math.random() * 4);
  await clearStock(world, [randomDelete], [randomDelete]);
  await AddCenterTiles(world);
  world.round++;
  if (world.round === 20) await endGame(world);
}

async function endGame(world: GameWorld) {
  world.gameState = GameStateType.GameOver;
  await clearStock(world, [0, 1, 2, 3], [0, 1, 2, 3]);
}
