import { Size } from "pixi.js";
import { CenterBoard } from "./center-board";
import Hitbox from "./hitbox";
import { MovePart } from "./move-part";
import Pickup from "./pickup";
import PlayerBoard from "./player-board";

export default interface GameWorld {
  round: number;
  center: CenterBoard;
  player: PlayerBoard;
  hitboxes: Hitbox[];
  lastPickup?: Pickup;
  history: Pickup[];
  movePart: MovePart;
  windowSize: Size;
}
