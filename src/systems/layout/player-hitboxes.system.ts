import { Point, PointData } from "pixi.js";
import GameWorld from "../../components/game-world";
import { HEX_SIZE, PLAYER_BOARD_TOP } from "../../consts/sizes";
import { getAvailableMoves } from "./available-move.system";
import Hitbox from "../../components/hitbox";
import { placeAnimal, placeTile } from "../round/move-parts.system";
import { drawEmptyHex, drawPlayerHex } from "./hex-render.system";
import { GameState } from "../../components/game-state";
import { ContainerType } from "../../components/container.type";

export function SetPlacedTilesHitboxes(world: GameWorld) {
  const tiles = world.player.tiles;
  const center = getPlayerBoardCenter(world);
  tiles.getAll().forEach((tile) => {
    const real = boardCoordsToReal(tile.point);
    const hit: Hitbox = {
      x: real.x + center.x,
      y: real.y + center.y,
      r: HEX_SIZE,
      isHex: true,
      container: ContainerType.Player,
      onRender: (me, g) => drawPlayerHex(g, tile, me),
      onClick: () => placeAnimal(world, tile.point),
    };
    world.hitboxes.push(hit);
  });
  getAvailableMoves(world).forEach((boardCoords) => {
    const real = boardCoordsToReal(boardCoords);
    const hit: Hitbox = {
      x: real.x + center.x,
      y: real.y + center.y,
      r: HEX_SIZE,
      isHex: true,
      container: ContainerType.Player,
      onRender: (me, g) => drawEmptyHex(g, me, world.gameState !== GameState.PlaceTile),
      onClick: () => placeTile(world, boardCoords),
    };
    world.hitboxes.push(hit);
  });
}

export function boardCoordsToReal(point: Point): PointData {
  return { x: point.x * HEX_SIZE * 0.866, y: point.y * HEX_SIZE * 1.5 };
}

function getPlayerBoardCenter(world: GameWorld): PointData {
  return new Point(world.windowSize.width / 2, (world.windowSize.height + PLAYER_BOARD_TOP) / 2 - 50);
}
