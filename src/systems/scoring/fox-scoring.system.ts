import { PlacedTile } from "../../components/placed-tile";
import Map2D from "../../helpers/map2d";
import { findModeCount } from "../generic/mode.system";
import { getNear } from "../hitboxes/available-move.system";

export function scoreFoxA(board: Map2D<PlacedTile>, foxId: number) {
  const foxes = board.getAll().filter((x) => x.occupied === foxId);
  let sum = 0;
  foxes.forEach((c) => {
    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied !== undefined);
    sum += near.length;
  });
  return sum;
}

export function scoreFoxC(board: Map2D<PlacedTile>, foxId: number) {
  const foxes = board.getAll().filter((x) => x.occupied === foxId);
  let sum = 0;
  foxes.forEach((c) => {
    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied !== undefined && x.occupied !== foxId)
      .map((x) => x!.occupied!);
    sum += findModeCount(near);
  });
  return sum;
}
