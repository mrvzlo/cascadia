import { Point } from "pixi.js";

export default interface Hitbox {
  x: number;
  y: number;
  r: number;

  type: "placedTile" | "stockTile" | "availableTile" | "stockAnimal";

  centerIndex?: number;

  boardCoords?: Point;
}
