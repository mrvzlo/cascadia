import { Container } from "pixi.js";
import GameWorld from "../../components/game-world";
import { SetCenterTileHitboxes } from "./center-board-layout.system";
import { SetPlacedTilesHitboxes } from "./player-board-layout.system";
import { RenderPlayerBoard } from "./player-board-render.system";
import { RenderCenterBoard } from "./center-board-render.system";
import { RenderPlayerScore } from "./score-render.system";

export function DrawBoard(container: Container, world: GameWorld) {
  world.hitboxes = [];
  SetCenterTileHitboxes(world);
  SetPlacedTilesHitboxes(world);

  RenderPlayerBoard(container, world);
  RenderCenterBoard(container, world);
  RenderPlayerScore(container, world);
}
