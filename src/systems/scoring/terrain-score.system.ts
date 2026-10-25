import PlayerBoard from "../../components/player-board";
import { PlacedTile } from "../../components/placed-tile";
import { HexNeighbors } from "../hitboxes/available-move.system";
import { Coords } from "../../components/coords";

export function setTerrainScore(player: PlayerBoard) {
  for (let i = 0; i < player.terrainScore.length; i++) player.terrainScore[i] = getMaxRegionSize(player, i);
}

function getMaxRegionSize(board: PlayerBoard, color: number) {
  const visited = new Set<string>();
  let maxRegionSize = 0;

  for (const tile of board.tiles.getAll()) {
    const startKey = getPointKey(tile.coords);
    if (!hasBiome(tile, color) || visited.has(startKey)) continue;

    const queue = [tile];
    visited.add(startKey);
    let regionSize = 0;

    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      regionSize++;

      for (const direction of HexNeighbors) {
        const neighborPoint: Coords = { intX: current.coords.intX + direction.intX, intY: current.coords.intY + direction.intY };
        const neighborKey = getPointKey(neighborPoint);
        if (visited.has(neighborKey)) continue;

        const neighbor = board.tiles.get(neighborPoint);
        if (
          !neighbor ||
          !hasBiomeOnEdge(current, color, getSharedEdge(direction)) ||
          !hasBiomeOnEdge(neighbor, color, (getSharedEdge(direction) + 3) % 6)
        )
          continue;

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

  const rotation = (tile.rotation ?? 0) % 6;
  const unrotatedEdge = (edge - rotation + 6) % 6;
  const biomeIndex = unrotatedEdge < 3 ? 0 : 1;
  return tile.bioms[biomeIndex] === color;
}

function getSharedEdge(direction: Coords) {
  if (direction.intX === 1 && direction.intY === 1) return 0;
  if (direction.intX === 2) return 1;
  if (direction.intX === 1 && direction.intY === -1) return 2;
  if (direction.intX === -1 && direction.intY === -1) return 3;
  if (direction.intX === -2) return 4;
  if (direction.intX === -1 && direction.intY === 1) return 5;
  throw new Error(`Unsupported hex neighbor offset (${direction.intX}, ${direction.intY})`);
}

function getPointKey(point: Coords) {
  return `${point.intX}|${point.intY}`;
}
