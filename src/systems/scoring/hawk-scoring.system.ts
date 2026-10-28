import { Coords } from "../../components/coords";
import { PlacedTile } from "../../components/placed-tile";
import PlayerBoard from "../../components/player-board";
import { ScoringRule } from "../../components/scoring-rule";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";
import Map2D from "../../helpers/map2d";
import { getNear } from "../hitboxes/available-move.system";
import { getFromProgression, getSameGroupSizes } from "./base-scoring.system";

export const getHawkSubType = (subType: number): ScoringRule => {
  const scoring = [scoreSingles, scoreHawksWithLOS, scoreLOSCount, scoreLOSPairs, scoreEdgeHawks];
  return (board: PlayerBoard) => scoring[subType](board.tiles);
};

function scoreSingles(board: Map2D<PlacedTile>) {
  const progression = [0, 2, 5, 8, 11, 14, 18, 22, 26];
  const singles = getSameGroupSizes(board, TilePairType.BirdMountain)[1] ?? 0;
  return getFromProgression(progression, singles);
}

function scoreHawksWithLOS(board: Map2D<PlacedTile>) {
  const progression = [0, 5, 9, 12, 16, 20, 24, 28];
  const hawksWithLOS = getHawksLOSs(board);
  return getFromProgression(progression, hawksWithLOS.size);
}

function scoreLOSCount(board: Map2D<PlacedTile>) {
  const losMap = getHawksLOSs(board);
  const losCount = [...losMap.values()].reduce((a, b) => a + b.length, 0);
  return losCount * 3;
}

function scoreLOSPairs(board: Map2D<PlacedTile>) {
  const losMap = getHawksLOSs(board);
  let sum = 0;
  losMap.forEach((list, hawk) => {
    if (list.length !== 1) return;
    const pair = losMap.get(list[0]);
    if (pair!.length !== 1 || pair![0] !== hawk) return;
    sum += 3.5;
  });
  return sum;
}

function scoreEdgeHawks(board: Map2D<PlacedTile>) {
  const progression = [0, 0, 0, 2, 2, 2, 4, 4, 4, 7, 7, 7, 10, 10, 10, 10, 14, 14, 14, 14, 18, 18, 18, 18, 18, 22, 22, 22, 22, 22, 27];
  const hawks = board.getAll().filter((x) => x.occupied === TilePairType.BirdMountain);
  let spaces = new Set<string>();
  hawks.forEach((x) =>
    getNear(x.coords)
      .filter((x) => !board.get(x) || board.get(x)!.occupied === TilePairType.Empty)
      .forEach((p) => spaces.add(p.intX + "|" + p.intY)),
  );
  return getFromProgression(progression, spaces.size);
}

function getHawksLOSs(board: Map2D<PlacedTile>) {
  const hawks = board.getAll().filter((tile) => tile.occupied === TilePairType.BirdMountain);
  const visibleHawks = new Map<string, string[]>();

  for (let first = 0; first < hawks.length; first++) {
    for (let second = first + 1; second < hawks.length; second++) {
      if (!haveUnobstructedLOS(board, hawks[first], hawks[second])) continue;
      if (!visibleHawks.get(hawks[first].id)) visibleHawks.set(hawks[first].id, []);
      if (!visibleHawks.get(hawks[second].id)) visibleHawks.set(hawks[second].id, []);
      visibleHawks.get(hawks[first].id)!.push(hawks[second].id);
      visibleHawks.get(hawks[second].id)!.push(hawks[first].id);
    }
  }

  return visibleHawks;
}

function haveUnobstructedLOS(board: Map2D<PlacedTile>, a: PlacedTile, b: PlacedTile) {
  const line = getLOSLine(a.coords, b.coords);
  if (!line || line.dist < 2) return false;

  for (let step = 1; step < line.dist; step++) {
    const point = { intX: a.coords.intX + line.stepX * step, intY: a.coords.intY + line.stepY * step };
    if (board.get(point)?.occupied === TilePairType.BirdMountain) return false;
  }

  return true;
}

function getLOSLine(a: Coords, b: Coords): LOS | null {
  const dx = b.intX - a.intX;
  const dy = b.intY - a.intY;

  if (dy === 0) return { stepX: Math.sign(dx) * 2, dist: Math.abs(dx) / 2, stepY: 0 };
  if (dx !== 0 && dx === dy) return { stepX: Math.sign(dx), dist: Math.abs(dx), stepY: Math.sign(dy) };
  return null;
}

type LOS = { stepX: number; stepY: number; dist: number };
