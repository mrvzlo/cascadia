import { PlacedTile } from "../../components/placed-tile";
import Map2D from "../../helpers/map2d";

export function findModeCount(values: number[]) {
  if (values.length < 2) return values.length;
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Math.max(...counts.values());
}

export function getAllOfSpecie(board: Map2D<PlacedTile>, specie: number) {
  return board.getAll().filter((x) => x.occupied === specie);
}
