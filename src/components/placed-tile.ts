import { Point } from "pixi.js";
import { Tile } from "./tile";

export interface PlacedTile extends Tile {
  occupied?: number;
  point: Point;
}
