import { Graphics } from "pixi.js";
import GameWorld from "../../components/game-world";
import { HEX_SIZE, PLACED_ANIMAL_R, STOCK_SIZE } from "../../consts/sizes";
import { pickAnimal, pickTile } from "../round/move-parts.system";
import Hitbox from "../../components/hitbox";
import { GameState } from "../../components/game-state";
import { AnimalColors } from "../../consts/tile-colors";
import { drawCenterHex } from "./hex-render.system";
import { ContainerType } from "../../components/container.type";
import { getTilePointOnStock } from "./board-position.system";
import { Tile } from "../../components/tile";

export function SetStockHitboxes(world: GameWorld) {
  for (let i = 0; i < STOCK_SIZE; i++) {
    const tilePos = getTilePointOnStock(world, i, 0);
    const tile = world.center.tileStock[i];
    if (tile !== undefined)
      world.hitboxes.push({
        ...tilePos,
        r: HEX_SIZE,
        isHex: true,
        container: world.center.tileFading === i ? ContainerType.Fading : ContainerType.Stock,
        onClick: (me) => pickTile(world, i, me),
        onRender: (me, g) => drawTile(me, world, g, i, tile),
      });
    const animal = world.center.animalStock[i];
    const animalPos = getTilePointOnStock(world, i, 1);
    if (animal !== undefined)
      world.hitboxes.push({
        ...animalPos,
        r: HEX_SIZE,
        isHex: false,
        container: world.center.animalFading === i ? ContainerType.Fading : ContainerType.Stock,
        onClick: (me) => pickAnimal(world, i, me),
        onRender: (me, g) => drawAnimal(me, world, g, i, animal),
      });
  }
}

function drawTile(hitbox: Hitbox, world: GameWorld, g: Graphics, index: number, tile: Tile) {
  const unselected =
    (world.gameState === GameState.PlaceTile && world.lastPickup?.tileIndex !== index) || world.gameState > GameState.PlaceTile;
  drawCenterHex(g, tile, hitbox, unselected);
}

function drawAnimal(hitbox: Hitbox, world: GameWorld, g: Graphics, index: number, animal: number) {
  const unselected =
    world.gameState === GameState.PlaceTile || (world.gameState === GameState.PlaceAnimal && world.lastPickup?.animalIndex !== index);
  const color = AnimalColors[animal] + (unselected ? "1" : "");
  g.circle(hitbox.x, hitbox.y, PLACED_ANIMAL_R).fill(color).stroke({ width: 2, color: "#000a" });
}
