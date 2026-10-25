import { Coords } from "../../components/coords";

export const getNear = (point: Coords) => HexNeighbors.map((near) => ({ intX: point.intX + near.intX, intY: point.intY + near.intY }));

export const HexNeighbors: Coords[] = [
  { intX: -2, intY: 0 },
  { intX: 2, intY: 0 },
  { intX: -1, intY: -1 },
  { intX: -1, intY: 1 },
  { intX: 1, intY: -1 },
  { intX: 1, intY: 1 },
];
