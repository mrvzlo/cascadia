import { PlacedTile } from "../../components/placed-tile";
import PlayerBoard from "../../components/player-board";
import { ScoringRule } from "../../components/scoring-rule";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";
import Map2D from "../../helpers/map2d";
import { getNear } from "../hitboxes/available-move.system";
import { getFromProgression, getSameGroupSizes } from "./base-scoring.system";

export const getBearSubType = (subType: number): ScoringRule => {
  const scoring = [scoreFamiliesOf2, scoreFamiliesOf3, scoreFamilies1to3, scoreFamilies2to4, scoreLonelyOnEdge];
  return (board: PlayerBoard) => scoring[subType](board.tiles);
};

export function scoreFamiliesOf2(board: Map2D<PlacedTile>) {
  const sizes = getSameGroupSizes(board, TilePairType.BearForest);
  return getFromProgression([0, 4, 11, 19, 27], sizes[2]);
}

export function scoreFamilies1to3(board: Map2D<PlacedTile>) {
  const sizes = getSameGroupSizes(board, TilePairType.BearForest);
  const all3 = sizes[1] > 0 && sizes[2] > 0 && sizes[3] > 0;
  return sizes[1] * 2 + sizes[2] * 5 + sizes[3] * 8 + (all3 ? 3 : 0);
}

export function scoreFamiliesOf3(board: Map2D<PlacedTile>) {
  const sizes = getSameGroupSizes(board, TilePairType.BearForest);
  return sizes[3] * 10;
}

export function scoreFamilies2to4(board: Map2D<PlacedTile>) {
  const sizes = getSameGroupSizes(board, TilePairType.BearForest);
  return sizes[4] * 13 + sizes[2] * 5 + sizes[3] * 8;
}

export function scoreLonelyOnEdge(board: Map2D<PlacedTile>) {
  const bears = board.getAll().filter((x) => x.occupied === TilePairType.BearForest);
  let count = 0;
  bears.forEach((x) => {
    const near = getNear(x.coords).map((p) => board.get(p));
    const isNotLonely = near.some((x) => x && x.occupied === TilePairType.BearForest);
    if (isNotLonely) return;
    const hasEmptySpace = near.some((x) => !x || x.occupied === TilePairType.Empty);
    if (hasEmptySpace) count++;
  });
  return count * 3;
}
