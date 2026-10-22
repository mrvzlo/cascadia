import { Graphics, Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import { boardCoordsToReal } from "./player-hitboxes.system";
import { HEX_SIZE, PLACED_ANIMAL_R } from "../../consts/sizes";
import { pickAnimal, pickTile } from "../round/move-parts.system";
import Hitbox from "../../components/hitbox";
import { GameState } from "../../components/game-state";
import { AnimalColors } from "../../consts/tile-colors";
import { drawCenterHex } from "./hex-render.system";
import { ContainerType } from "../../components/container.type";

export function SetStockHitboxes(world: GameWorld) {
  const center = GetTopBoardCenter(world);
  world.center.tileStock.forEach((_, i) => {
    const real = boardCoordsToReal(new Point((i - 1.5) * 2.4, 1));
    const tile: Hitbox = {
      x: real.x + center.x,
      y: real.y + center.y,
      r: HEX_SIZE,
      isHex: true,
      container: world.center.tileFading === i ? ContainerType.Fading : ContainerType.Stock,
      onClick: () => pickTile(world, i),
      onRender: (me, g) => drawTile(me, world, g, i),
    };
    const animal: Hitbox = {
      x: real.x + center.x,
      y: real.y + center.y + HEX_SIZE * 2,
      r: HEX_SIZE,
      isHex: false,
      container: world.center.animalFading === i ? ContainerType.Fading : ContainerType.Stock,
      onClick: () => pickAnimal(world, i),
      onRender: (me, g) => drawAnimal(me, world, g, i),
    };
    world.hitboxes.push(tile, animal);
  });
}

function GetTopBoardCenter(world: GameWorld) {
  return new Point(world.windowSize.width / 2, 0);
}

function drawTile(hitbox: Hitbox, world: GameWorld, g: Graphics, index: number) {
  const unselected =
    (world.gameState === GameState.PlaceTile && world.lastPickup?.tileIndex !== index) || world.gameState > GameState.PlaceTile;
  drawCenterHex(g, world.center.tileStock[index], hitbox, unselected);
}

function drawAnimal(hitbox: Hitbox, world: GameWorld, g: Graphics, index: number) {
  if (world.center.animalStock[index] === undefined) return;
  const unselected =
    world.gameState === GameState.PlaceTile || (world.gameState === GameState.PlaceAnimal && world.lastPickup?.animalIndex !== index);
  const color = AnimalColors[world.center.animalStock[index]] + (unselected ? "1" : "");
  g.circle(hitbox.x, hitbox.y, PLACED_ANIMAL_R).fill(color).stroke({ width: 2, color: "#000a" });
}
