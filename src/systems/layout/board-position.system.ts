import { Point, PointData } from "pixi.js";
import GameWorld from "../../components/game-world";
import { HEX_SIZE, PLAYER_BOARD_TOP } from "../../consts/sizes";

export function getTilePointOnPlayerBoard(world: GameWorld, point: Point): PointData {
  const real = mapCoordsToReal(point);
  return { x: real.x + world.windowSize.width / 2, y: real.y + (world.windowSize.height + PLAYER_BOARD_TOP) / 2 - 50 };
}

export function getTilePointOnStock(world: GameWorld, col: number, row: number): PointData {
  const real = mapCoordsToReal(new Point((col - 1.5) * 2.4, 1 + 1.2 * row));
  return { x: real.x + world.windowSize.width / 2, y: real.y };
}

function mapCoordsToReal(point: Point): PointData {
  return { x: point.x * HEX_SIZE * 0.866, y: point.y * HEX_SIZE * 1.5 };
}
