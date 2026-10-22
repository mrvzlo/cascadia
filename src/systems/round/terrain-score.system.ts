import { Point } from "pixi.js";
import PlayerBoard from "../../components/player-board";
import { PlacedTile } from "../../components/placed-tile";
import { HexNeighboors } from "../layout/available-move.system";

export function setTerrainScore(player: PlayerBoard) {
  for (let i = 0; i < player.terrainScore.length; i++) player.terrainScore[i] = getMaxRegionSize(player, i);
}

function getMaxRegionSize(board: PlayerBoard, color: number) {
  const visited = new Set<string>();
  let maxRegionSize = 0;

  for (const tile of board.tiles.getAll()) {
    const startKey = getPointKey(tile.point);
    if (!hasBiome(tile, color) || visited.has(startKey)) continue;

    const queue = [tile];
    visited.add(startKey);
    let regionSize = 0;

    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      regionSize++;

      for (const direction of HexNeighboors) {
        const neighborPoint = new Point(current.point.x + direction.x, current.point.y + direction.y);
        const neighborKey = getPointKey(neighborPoint);
        if (visited.has(neighborKey)) continue;

        const neighbor = board.tiles.get(neighborPoint);
        if (
          !neighbor ||
          !hasBiomeOnEdge(current, color, getSharedEdge(direction)) ||
          !hasBiomeOnEdge(neighbor, color, (getSharedEdge(direction) + 3) % 6)
        ) {
          continue;
        }

        visited.add(neighborKey);
        queue.push(neighbor);
      }
    }

    maxRegionSize = Math.max(maxRegionSize, regionSize);
  }

  return maxRegionSize;
}

function hasBiome(tile: PlacedTile, color: number) {
  return tile.bioms.includes(color);
}

function hasBiomeOnEdge(tile: PlacedTile, color: number, edge: number) {
  if (tile.bioms.length === 1) return tile.bioms[0] === color;
  if (tile.bioms.length < 2) return false;

  const rotation = (((tile.rotation ?? 0) % 6) + 6) % 6;
  const unrotatedEdge = (edge - rotation + 6) % 6;
  const biomeIndex = unrotatedEdge < 3 ? 0 : 1;
  return tile.bioms[biomeIndex] === color;
}

function getSharedEdge(direction: Point) {
  if (direction.x === -2) return 4;
  if (direction.x === 2) return 1;
  if (direction.x === -1 && direction.y === -1) return 5;
  if (direction.x === -1 && direction.y === 1) return 3;
  if (direction.x === 1 && direction.y === -1) return 0;
  if (direction.x === 1 && direction.y === 1) return 2;
  throw new Error(`Unsupported hex neighbor offset (${direction.x}, ${direction.y})`);
}

function getPointKey(point: Point) {
  return `${point.x},${point.y}`;
}
