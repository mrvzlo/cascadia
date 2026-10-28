import { PlacedTile } from "../../components/placed-tile";
import PlayerBoard from "../../components/player-board";
import { ScoringRule } from "../../components/scoring-rule";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";
import Map2D from "../../helpers/map2d";
import { findModeCount } from "../generic/mode.system";
import { getNear } from "../hitboxes/available-move.system";

export const getFoxSubType = (subType: number): ScoringRule => {
  const scoring = [scoreDivercity, scoreLargestNear, scoreSurrounded];
  return (board: PlayerBoard) => scoring[subType](board.tiles);
};

function scoreDivercity(board: Map2D<PlacedTile>) {
  const foxes = board.getAll().filter((x) => x.occupied === TilePairType.FoxLawn);
  let sum = 0;
  foxes.forEach((c) => {
    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied !== TilePairType.Empty)
      .map((x) => x!.occupied);
    sum += new Set(near).size;
  });
  return sum;
}

function scoreFoxB(board: Map2D<PlacedTile>) {
  const foxes = board.getAll().filter((x) => x.occupied === TilePairType.FoxLawn);
  let sum = 0;
  const progression = [0, 3, 5, 7];
  foxes.forEach((c) => {
    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied !== TilePairType.Empty && x.occupied !== TilePairType.FoxLawn)
      .map((x) => x!.occupied!)
      .sort();

    // count pairs
  });
  return sum;
}

function scoreLargestNear(board: Map2D<PlacedTile>) {
  const foxes = board.getAll().filter((x) => x.occupied === TilePairType.FoxLawn);
  let sum = 0;
  foxes.forEach((c) => {
    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied !== TilePairType.Empty && x.occupied !== TilePairType.FoxLawn)
      .map((x) => x!.occupied);
    sum += findModeCount(near);
  });
  return sum;
}

function scoreSurrounded(board: Map2D<PlacedTile>) {
  const foxes = board.getAll().filter((x) => x.occupied === TilePairType.FoxLawn);
  let sum = 0;
  foxes.forEach((c) => {
    const near = getNear(c.coords)
      .map((x) => board.get(x))
      .filter((x) => !!x && x.occupied !== TilePairType.Empty).length;
    sum += near === 6 ? 4 : near > 3 ? 2 : 0;
  });
  return sum;
}
