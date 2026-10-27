import { PlacedTile } from "../../components/placed-tile";
import Map2D from "../../helpers/map2d";
import { getNear } from "../hitboxes/available-move.system";

export function scoreBeardA(board: Map2D<PlacedTile>, bearId: number) {
  const sizes = getBearGroupSize(board, bearId);
  switch (sizes[2]) {
    case 0:
      return 0;
    case 1:
      return 4;
    case 2:
      return 11;
    case 3:
      return 19;
    default:
      return 27;
  }
}

export function scoreBeardC(board: Map2D<PlacedTile>, bearId: number) {
  const sizes = getBearGroupSize(board, bearId);
  const all3 = sizes[1] > 0 && sizes[2] > 0 && sizes[3] > 0;
  return sizes[1] * 2 + sizes[2] * 5 + sizes[3] * 8 + (all3 ? 3 : 0);
}

export function scoreBeardB(board: Map2D<PlacedTile>, bearId: number) {
  const sizes = getBearGroupSize(board, bearId);
  return sizes[3] * 10;
}

export function scoreBeardD(board: Map2D<PlacedTile>, bearId: number) {
  const sizes = getBearGroupSize(board, bearId);
  return sizes[4] * 13 + sizes[2] * 5 + sizes[3] * 8;
}

function getBearGroupSize(board: Map2D<PlacedTile>, bearId: number) {
  const bears = board.getAll().filter((x) => x.occupied === bearId);
  const visited = new Set<string>();
  const sizes = [0, 0, 0, 0, 0];

  let sum = 0;
  bears.forEach((c) => {
    if (visited.has(c.id)) return;
    visited.add(c.id);

    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied === bearId);
    sum += near.length;
  });
  return sizes;
}
