import { PlacedTile } from "../../components/placed-tile";
import { HexNeighbors } from "../hitboxes/available-move.system";
import { Coords } from "../../components/coords";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";
import GameWorld from "../../components/game-world";
import { checkShareEdge } from "./share-edge.system";
import Map2D from "../../helpers/map2d";

export function setTerrainScore(world: GameWorld) {
  for (let i = 0; i < world.player.terrainScore.length; i++)
    world.player.terrainScore[i] = getMaxRegionSize(world.player.tiles, world.animalSetup[i]);
}

function getMaxRegionSize(tiles: Map2D<PlacedTile>, type: TilePairType) {
  const visited = new Set<string>();
  let maxRegionSize = 0;

  for (const tile of tiles.getAll()) {
    const startKey = getPointKey(tile.coords);
    if (!hasBiome(tile, type) || visited.has(startKey)) continue;

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

        const neighbor = tiles.get(neighborPoint);
        if (!neighbor || !checkShareEdge(current, neighbor, type, direction)) continue;

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

function getPointKey(point: Coords) {
  return `${point.intX}|${point.intY}`;
}
