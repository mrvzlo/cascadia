import { Container, Graphics, Point, PointData, Size, Text, TextStyleOptions } from "pixi.js";
import GameWorld from "../../components/game-world";
import { boardCoordsToReal } from "./player-board-layout.system";
import { PLAYER_BOARD_TOP } from "../../consts/sizes";
import { drawEmptyHex, drawPlayerHex } from "./hex-render.system";
import { MovePart } from "../../components/move-part";

export function RenderPlayerBoard(container: Container, world: GameWorld) {
  const g = new Graphics();
  container.addChild(g);
  const center = GetPlayerBoardCenter(world);

  world.hitboxes.forEach((h) => {
    if (!h.boardCoords) return;
    const real = boardCoordsToReal(h.boardCoords);
    real.x += center.x;
    real.y += center.y;
    const tile = world.player.tiles.get(h.boardCoords);
    if (tile) drawPlayerHex(g, tile, real);
    else drawEmptyHex(g, real, world.movePart !== MovePart.PlaceTile);
  });
}

export function GetPlayerBoardCenter(world: GameWorld) {
  return new Point(world.windowSize.width / 2, (world.windowSize.height + PLAYER_BOARD_TOP) / 2 - 50);
}
