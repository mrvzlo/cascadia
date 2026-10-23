import { Application, Point } from "pixi.js";
import GameWorld from "../components/game-world";
import Hitbox from "../components/hitbox";
import { SQRT3 } from "../consts/sizes";
import { GameState } from "../components/game-state";
import { redraw } from "../systems/animations/base-animation.system";

export function setupClickHandling(app: Application, world: GameWorld) {
  app.stage.addChild(world.playerContainer);
  app.stage.addChild(world.topContainer);
  app.stage.addChild(world.fadingContainer);
  app.stage.addChild(world.scoreContainer);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (event) => {
    if (world.gameState === GameState.Waiting) return;
    handleClick(world, event.global);
  });
  Object.assign(window, { baba: () => world });
  redraw(world);

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyQ" || e.code === "KeyE") rotateActiveTile(world, e.code === "KeyQ");
  });
}

function rotateActiveTile(world: GameWorld, left: boolean) {
  if (world.gameState !== GameState.PlaceTile) return;
  const tile = world.lastPickup!.tile;
  tile.rotation = ((tile.rotation ?? 0) + (left ? 1 : 5)) % 6;
  redraw(world);
}

async function handleClick(world: GameWorld, pos: Point) {
  const clicked = world.hitboxes.find((h) => checkHexClick(h, pos));
  if (clicked && clicked.onClick) await clicked.onClick(clicked);
  else if (world.gameState === GameState.PlaceAnimal || world.gameState === GameState.PlaceTile) {
    world.gameState--;
    redraw(world);
  }
}

function checkHexClick(hitbox: Hitbox, pos: Point) {
  const dx = Math.abs(pos.x - hitbox.x);
  const dy = Math.abs(pos.y - hitbox.y);
  if (dx * dx + dy * dy > hitbox.r * hitbox.r) return false;
  if (hitbox.isHex) return dx <= (SQRT3 * hitbox.r) / 2 && SQRT3 * dx + dy <= SQRT3 * hitbox.r;
  return true;
}

//todo add map shifting
