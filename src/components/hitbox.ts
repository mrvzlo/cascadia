import { Graphics, PointData } from "pixi.js";
import { PlacedTile } from "./placed-tile";
import { ContainerType } from "./container.type";

export default interface Hitbox extends PointData {
  r: number;
  tile?: PlacedTile;
  isHex: boolean;
  container: ContainerType;

  onClick: ((me: Hitbox) => Promise<void>) | ((me: Hitbox) => void);
  onRender: (me: Hitbox) => Graphics;
}
