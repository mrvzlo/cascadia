import { Container, Graphics, Point, Size } from "pixi.js";
import { CenterBoard } from "./center-board";
import Hitbox from "./hitbox";
import { GameStateType } from "../consts/enums/game-state.type";
import Pickup from "./pickup";
import PlayerBoard from "./player-board";
import { IdManager } from "../helpers/id-manager";

export default interface GameWorld {
  round: number;
  center: CenterBoard;
  player: PlayerBoard;
  lastPickup?: Pickup;
  gameState: GameStateType;
  // UX
  isWaiting: boolean;
  hitboxes: Map<string, Hitbox>;
  // UI
  windowSize: Size;
  animalContainer: Container;
  tileContainer: Container;
  scoreContainer: Container;
  controlsContiner: Container;

  //helpers
  idMngr: IdManager;
}
