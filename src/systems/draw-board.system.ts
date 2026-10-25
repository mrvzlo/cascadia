import GameWorld from "../components/game-world";
import { CreateGraphics } from "./hitboxes/create-hitboxes.system";
import { RenderPlayerScore } from "./render/score-render.system";
import { Graphics } from "pixi.js";
import { PLAYER_BOARD_TOP } from "../consts/sizes";

export function DrawBoard(world: GameWorld) {
  renderLayout(world);
  CreateGraphics(world);
  UpdateScore(world);
}

export function UpdateScore(world: GameWorld) {
  world.scoreContainer.removeChildren().forEach((child) => child.destroy());
  RenderPlayerScore(world.scoreContainer, world);
}

function renderLayout(world: GameWorld) {
  const g = new Graphics();
  g.rect(0, PLAYER_BOARD_TOP, world.windowSize.width, 1).stroke(0);
  world.layoutGraphics = g;
  world.topContainer.addChild(g);
}
