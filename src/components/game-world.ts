import { Container, Point, Size } from "pixi.js";
import { CenterBoard } from "./center-board";
import Hitbox from "./hitbox";
import { GameState } from "./game-state";
import Pickup from "./pickup";
import PlayerBoard from "./player-board";

export default interface GameWorld {
  round: number;
  center: CenterBoard;
  player: PlayerBoard;
  lastPickup?: Pickup;
  gameState: GameState;
  // UX
  isWaiting: boolean;
  hitboxes: Hitbox[];
  // UI
  windowSize: Size;
  playerContainer: Container;
  topContainer: Container;
  scoreContainer: Container;
  fadingContainer: Container;

  dragContainer: Container;
}
