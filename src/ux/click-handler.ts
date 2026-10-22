import { Application, Container, Point } from "pixi.js";
import GameWorld from "../components/game-world";
import { DrawBoard } from "../systems/layout/draw-board.system";
import Hitbox from "../components/hitbox";
import { SQRT3 } from "../consts/sizes";
import { MovePart } from "../components/move-part";
import { GetTopBoardCenter } from "../systems/layout/center-board-render.system";
import { GetPlayerBoardCenter } from "../systems/layout/player-board-render.system";

const gameContainer = new Container();
const highlightContainer = new Container();

export function setupClickHandling(app: Application, world: GameWorld) {
  app.stage.addChild(gameContainer);
  app.stage.addChild(highlightContainer);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (event) => handleClick(world, event.global));
  Object.assign(window, { baba: () => world });
  redraw(world);

  window.addEventListener("keydown", (e) => {
    if (e.key === "q" || e.key === "e") {
      if (world.movePart !== MovePart.PlaceTile) return;
      const tile = world.lastPickup!.tile;
      tile.rotation = ((tile.rotation ?? 0) + (e.key === "q" ? 1 : 5)) % 6;
      redraw(world);
    }
  });
}

function handleClick(world: GameWorld, pos: Point) {
  console.log(world.movePart);
  switch (world.movePart) {
    case MovePart.PickTile:
      const topTileH = world.hitboxes.filter((h) => h.type === "stockTile").find((h) => checkHexClick(h, pos, GetTopBoardCenter(world)));
      if (topTileH) pickTile(world, topTileH);
      break;
    case MovePart.PlaceTile:
      const boardTileH = world.hitboxes
        .filter((h) => h.type === "availableTile")
        .find((h) => checkHexClick(h, pos, GetPlayerBoardCenter(world)));
      console.log(boardTileH);
      if (boardTileH) placeTile(world, boardTileH);
      else world.movePart--;
      break;
    case MovePart.PickAnimal:
    case MovePart.PlaceAnimal:
  }
  redraw(world);
}

function checkHexClick(hitbox: Hitbox, pos: Point, center: Point) {
  const dx = Math.abs(pos.x - hitbox.x - center.x);
  const dy = Math.abs(pos.y - hitbox.y - center.y);
  if (dx * dx + dy * dy > hitbox.r * hitbox.r) return false;
  if (hitbox.type === "availableTile" || hitbox.type === "stockTile" || hitbox.type === "placedTile")
    return dx <= (SQRT3 * hitbox.r) / 2 && SQRT3 * dx + dy <= SQRT3 * hitbox.r;

  return true;
}

function pickTile(world: GameWorld, hitbox: Hitbox) {
  const tile = world.center.tileStock[hitbox.centerIndex!];
  world.lastPickup = { tile };
  world.movePart++;
}

function placeTile(world: GameWorld, hitbox: Hitbox) {
  const coords = hitbox.boardCoords!;
  world.lastPickup!.tileCoords = coords;
  world.player.tiles.set(coords, { ...world.lastPickup!.tile, point: coords });
  world.movePart--;
}

function redraw(world: GameWorld) {
  gameContainer.removeChildren();
  DrawBoard(gameContainer, world);
}
