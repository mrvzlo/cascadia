import { Graphics, PointData } from "pixi.js";
import { GameElementType } from "../consts/enums/game-element.type";

export default interface Hitbox {
  id: string;
  point: PointData;
  r: number;

  renderedOn: string;
  renderedType: GameElementType;
  graphics: Graphics;
}
