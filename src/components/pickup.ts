import { Point } from "pixi.js";
import { Tile } from "./tile";

export default interface Pickup {
  tile: Tile;
  tileCoords?: Point;
  animal?: number;
  animalCoords?: Point;
}
