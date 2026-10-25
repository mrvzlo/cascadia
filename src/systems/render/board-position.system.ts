import { PointData } from "pixi.js";
import GameWorld from "../../components/game-world";
import { HEX_SIZE, PLAYER_BOARD_TOP } from "../../consts/sizes";
import { Coords } from "../../components/coords";

export function getTilePointOnPlayerBoard(world: GameWorld, coords: Coords): PointData {
  const center = mapCoordsToHexCenter(coords.intX, coords.intY);
  return { x: center.x + world.windowSize.width / 2, y: center.y + (world.windowSize.height + PLAYER_BOARD_TOP) / 2 - 50 };
}

export function getTilePointOnStock(world: GameWorld, col: number, row: number): PointData {
  const center = mapCoordsToHexCenter((col - 1.5) * 2.4, 1 + 1.2 * row);
  return { x: center.x + world.windowSize.width / 2, y: center.y };
}

function mapCoordsToHexCenter(intX: number, intY: number): PointData {
  return { x: intX * HEX_SIZE * 0.866, y: intY * HEX_SIZE * 1.5 };
}
