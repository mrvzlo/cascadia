import GameWorld from "../../components/game-world";
import { SetStockHitboxes } from "./stock-hitboxes.system";
import { SetPlacedTilesHitboxes } from "./player-hitboxes.system";
import { RenderPlayerScore } from "./score-render.system";
import { Container, Graphics } from "pixi.js";
import { PLAYER_BOARD_TOP } from "../../consts/sizes";
import { ContainerType } from "../../components/container.type";

export function DrawBoard(world: GameWorld) {
  renderLayout(world);
  world.hitboxes = [];
  SetStockHitboxes(world);
  SetPlacedTilesHitboxes(world);

  RenderPlayerScore(world.scoreContainer, world);
  renderHitboxes(world);
}

function renderHitboxes(world: GameWorld) {
  const containers: Container[] = [];
  containers[ContainerType.Fading] = world.fadingContainer;
  containers[ContainerType.Player] = world.playerContainer;
  containers[ContainerType.Stock] = world.topContainer;

  world.hitboxes.forEach((h) => {
    containers[h.container].addChild(h.onRender(h));
  });
}

function renderLayout(world: GameWorld) {
  const g = new Graphics();
  world.topContainer.addChild(g);
  g.rect(0, PLAYER_BOARD_TOP, world.windowSize.width, 1).stroke(0);
}
