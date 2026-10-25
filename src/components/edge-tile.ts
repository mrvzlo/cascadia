import { PointData } from "pixi.js";
import { Coords } from "./coords";

export interface EdgeTile {
  id: string;
  hitboxId?: string;
  coords: Coords;
}
