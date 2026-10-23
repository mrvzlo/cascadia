import GameWorld from "../../components/game-world";
import { HEX_SIZE } from "../../consts/sizes";
import { getAvailableMoves } from "./available-move.system";
import Hitbox from "../../components/hitbox";
import { placeAnimal, placeTile } from "../round/move-parts.system";
import { drawEmptyHex, drawPlayerHex } from "./hex-render.system";
import { GameState } from "../../components/game-state";
import { ContainerType } from "../../components/container.type";
import { getTilePointOnPlayerBoard } from "./board-position.system";

export function SetPlacedTilesHitboxes(world: GameWorld) {
  const tiles = world.player.tiles;
  tiles.getAll().forEach((tile) => {
    const real = getTilePointOnPlayerBoard(world, tile.point);
    const hit: Hitbox = {
      ...real,
      r: HEX_SIZE,
      isHex: true,
      container: ContainerType.Player,
      onRender: (me, g) => drawPlayerHex(g, tile, me),
      onClick: () => placeAnimal(world, tile.point),
    };
    world.hitboxes.push(hit);
  });
  getAvailableMoves(world).forEach((boardCoords) => {
    const real = getTilePointOnPlayerBoard(world, boardCoords);
    const hit: Hitbox = {
      ...real,
      r: HEX_SIZE,
      isHex: true,
      container: ContainerType.Player,
      onRender: (me, g) => drawEmptyHex(g, me, world.gameState !== GameState.PlaceTile),
      onClick: () => placeTile(world, boardCoords),
    };
    world.hitboxes.push(hit);
  });
}
