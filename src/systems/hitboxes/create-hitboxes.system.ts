import GameWorld from "../../components/game-world";
import { HEX_SIZE, STOCK_SIZE } from "../../consts/sizes";
import Hitbox from "../../components/hitbox";
import { drawCenterHex, drawEmptyHex, drawPlayerHex } from "../render/hex-render.system";
import { getTilePointOnPlayerBoard, getTilePointOnStock } from "../render/board-position.system";
import { drawAnimal } from "../render/animal-render.system";
import { GameElementType } from "../../consts/enums/game-element.type";
import { PlacedTile } from "../../components/placed-tile";
import { getNear } from "./available-move.system";
import { EdgeTile } from "../../components/edge-tile";

export function CreateGraphics(world: GameWorld) {
  for (let i = 0; i < STOCK_SIZE; i++) {
    createStockTileGraphics(world, i);
    createAnimalGraphics(world, i);
  }
  world.player.tiles.getAll().forEach((x) => createBoardTileHitbox(world, x));
}

function createStockTileGraphics(world: GameWorld, index: number) {
  const tile = world.center.tileStock[index];
  if (!tile || tile.hitboxId !== undefined) return;
  const tilePos = getTilePointOnStock(world, index, 0);
  const id = world.idMngr.getNext("H");
  tile.hitboxId = id;
  const hitbox: Hitbox = {
    id,
    point: tilePos,
    r: HEX_SIZE,
    renderedOn: tile.id,
    renderedType: GameElementType.StockTile,
    graphics: drawCenterHex(tile, tilePos),
  };
  world.hitboxes.set(tile.hitboxId, hitbox);
  world.tileContainer.addChild(hitbox.graphics);
}

function createAnimalGraphics(world: GameWorld, index: number) {
  const tile = world.center.animalStock[index];
  if (!tile || tile.hitboxId !== undefined) return;
  const animalPos = getTilePointOnStock(world, index, 1);
  const id = world.idMngr.getNext("H");
  tile.hitboxId = id;
  const hitbox: Hitbox = {
    id,
    point: animalPos,
    r: HEX_SIZE,
    renderedOn: tile.id,
    renderedType: GameElementType.StockAnimal,
    graphics: drawAnimal(animalPos, tile.value, true),
  };

  world.hitboxes.set(id, hitbox);
  world.animalContainer.addChild(hitbox.graphics);
}

function createBoardTileHitbox(world: GameWorld, tile: PlacedTile) {
  if (!tile) return;
  createSurroundingEdges(world, tile);
  if (tile.hitboxId !== undefined) return;
  const tilePos = getTilePointOnPlayerBoard(world, tile.coords);
  const id = world.idMngr.getNext("H");
  tile.hitboxId = id;

  const hitbox: Hitbox = {
    id,
    point: tilePos,
    r: HEX_SIZE,
    renderedOn: tile.id,
    renderedType: GameElementType.BoardTile,
    graphics: drawPlayerHex(tile, tilePos),
  };
  world.hitboxes.set(id, hitbox);
  world.tileContainer.addChild(hitbox.graphics);
}

function createSurroundingEdges(world: GameWorld, tile: PlacedTile) {
  getNear(tile.coords).forEach((x) => {
    if (world.player.tiles.has(x) || world.player.edges.has(x)) return;
    const tile: EdgeTile = { id: world.idMngr.getNext("E"), coords: x };
    createEdgeTileHitbox(world, tile);
    world.player.edges.set(x, tile);
  });
}

function createEdgeTileHitbox(world: GameWorld, edge: EdgeTile) {
  const tilePos = getTilePointOnPlayerBoard(world, edge.coords);
  const id = world.idMngr.getNext("H");
  edge.hitboxId = id;

  const hitbox: Hitbox = {
    id,
    point: tilePos,
    r: HEX_SIZE,
    renderedOn: edge.id,
    renderedType: GameElementType.EdgeTile,
    graphics: drawEmptyHex(tilePos),
  };
  world.hitboxes.set(id, hitbox);
  world.animalContainer.addChild(hitbox.graphics);
}
