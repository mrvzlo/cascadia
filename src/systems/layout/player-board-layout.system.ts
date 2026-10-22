import { Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import { HEX_SIZE } from "../../consts/sizes";
import { getAvailableMoves } from "./available-move.system";

export function SetPlacedTilesHitboxes(world: GameWorld) {
  const tiles = world.player.tiles;
  tiles.getAll().forEach((tile) => {
    const real = boardCoordsToReal(tile.point);
    world.hitboxes.push({ x: real.x, y: real.y, r: HEX_SIZE, type: "placedTile", boardCoords: tile.point });
  });
  getAvailableMoves(world).forEach((boardCoords) => {
    const real = boardCoordsToReal(boardCoords);
    world.hitboxes.push({ x: real.x, y: real.y, r: HEX_SIZE, type: "availableTile", boardCoords });
  });
}

export function boardCoordsToReal(point: Point) {
  return new Point(point.x * HEX_SIZE * 0.866, point.y * HEX_SIZE * 1.5);
}
