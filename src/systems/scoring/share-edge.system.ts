import { Coords } from "../../components/coords";
import type { PlacedTile } from "../../components/placed-tile";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";

export function checkShareEdge(current: PlacedTile, neighbor: PlacedTile, type: TilePairType, direction: Coords) {
  return hasBiomeOnEdge(current, type, getSharedEdge(direction)) && hasBiomeOnEdge(neighbor, type, (getSharedEdge(direction) + 3) % 6);
}

export function hasBiomeOnEdge(tile: Pick<PlacedTile, "bioms" | "rotation">, value: TilePairType, edge: number) {
  if (tile.bioms.length === 1) return tile.bioms[0] === value;
  if (tile.bioms.length < 2) return false;

  const rotation = (tile.rotation ?? 0) % 6;
  const unrotatedEdge = (edge - rotation + 6) % 6;
  const biomeIndex = unrotatedEdge < 3 ? 0 : 1;
  return tile.bioms[biomeIndex] === value;
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
