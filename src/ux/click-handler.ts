import { Application, Point } from "pixi.js";
import GameWorld from "../components/game-world";
import Hitbox from "../components/hitbox";
import { SQRT3 } from "../consts/sizes";
import { GameStateType } from "../consts/enums/game-state.type";
import { animateTileRotate } from "../systems/animations/tile-animation.system";
import { DrawBoard } from "../systems/draw-board.system";
import { GameElementType } from "../consts/enums/game-element.type";
import { pickAnimal, pickTile, placeAnimal, placeTile } from "../systems/round/move-parts.system";
import { checkElementActiveState, setGameStateToPickAnimal, setGameStateToPickTile } from "../systems/round/state-management.system";

export function setupClickHandling(app: Application, world: GameWorld) {
  app.stage.addChild(world.tileContainer);
  app.stage.addChild(world.animalContainer);
  app.stage.addChild(world.scoreContainer);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (event) => {
    if (world.isWaiting) return;
    handleClick(world, event.global).finally(() => (world.isWaiting = false));
  });
  Object.assign(window, { baba: () => world });
  DrawBoard(world);

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyQ" || e.code === "KeyE") rotateActiveTile(world, e.code === "KeyQ");
  });
}

async function rotateActiveTile(world: GameWorld, left: boolean) {
  if (!world.lastPickup) return;
  const pickup = world.lastPickup!;
  pickup.tile.rotation = ((pickup.tile.rotation ?? 0) + (left ? 1 : 5)) % 6;
  await animateTileRotate(pickup.tileHitbox, pickup.tile.rotation);
}

async function handleClick(world: GameWorld, pos: Point) {
  const clicked = Array.from(world.hitboxes.values()).find(
    (h) => checkElementActiveState(world.gameState, h.renderedType) && checkHexClick(h, pos),
  );
  if (clicked)
    switch (world.gameState) {
      case GameStateType.PickTile:
        return pickTile(world, clicked);
      case GameStateType.PlaceTile:
        return placeTile(world, clicked);
      case GameStateType.PickAnimal:
        return pickAnimal(world, clicked);
      case GameStateType.PlaceAnimal:
        return placeAnimal(world, clicked);
    }
  else {
    if (world.gameState === GameStateType.PlaceAnimal) setGameStateToPickAnimal(world);
    if (world.gameState === GameStateType.PlaceTile) setGameStateToPickTile(world);
  }
}

function checkHexClick(hitbox: Hitbox, pos: Point) {
  const dx = Math.abs(pos.x - hitbox.point.x);
  const dy = Math.abs(pos.y - hitbox.point.y);
  if (dx * dx + dy * dy > hitbox.r * hitbox.r) return false;
  const isHex =
    hitbox.renderedType === GameElementType.BoardTile ||
    hitbox.renderedType === GameElementType.EdgeTile ||
    hitbox.renderedType === GameElementType.StockTile;
  if (isHex) return dx <= (SQRT3 * hitbox.r) / 2 && SQRT3 * dx + dy <= SQRT3 * hitbox.r;
  return true;
}

//todo add map shifting
