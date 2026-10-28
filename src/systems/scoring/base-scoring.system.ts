import { PlacedTile } from "../../components/placed-tile";
import Map2D from "../../helpers/map2d";
import { getNear } from "../hitboxes/available-move.system";

export function getFromProgression(progression: number[], index: number) {
  if (index === 0) return 0;
  if (index >= progression.length) return progression[progression.length - 1];
  return progression[index];
}

export function getSameGroupSizes(board: Map2D<PlacedTile>, id: number) {
  const sameAnimals = board.getAll().filter((x) => x.occupied === id);
  const visited = new Set<string>();
  const sizes: number[] = [];

  for (const a of sameAnimals) {
    if (visited.has(a.id)) continue;

    const group = [a];
    visited.add(a.id);

    for (let index = 0; index < group.length; index++) {
      for (const point of getNear(group[index].coords)) {
        const neighbor = board.get(point);
        if (!neighbor || neighbor.occupied !== id || visited.has(neighbor.id)) continue;

        visited.add(neighbor.id);
        group.push(neighbor);
      }
    }

    sizes[group.length] = (sizes[group.length] ?? 0) + 1;
  }

  return sizes;
}
