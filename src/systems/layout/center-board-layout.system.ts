import { Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import { boardCoordsToReal } from "./player-board-layout.system";
import { HEX_SIZE } from "../../consts/sizes";

export function SetCenterTileHitboxes(world: GameWorld) {
  world.center.tileStock.forEach((_, centerIndex) => {
    const real = boardCoordsToReal(new Point((centerIndex - 1.5) * 2.4, 1));
    world.hitboxes.push({ x: real.x, y: real.y, r: HEX_SIZE, type: "stockTile", centerIndex });
    world.hitboxes.push({ x: real.x, y: real.y + HEX_SIZE * 2, r: HEX_SIZE, type: "stockAnimal", centerIndex });
  });

  // add animal hitboxes
}
