import { Container, Graphics, Point, Size } from "pixi.js";
import GameWorld from "../../components/game-world";
import { HEX_SIZE, PLACED_ANIMAL_R, PLAYER_BOARD_TOP } from "../../consts/sizes";
import { drawCenterHex } from "./hex-render.system";
import { boardCoordsToReal } from "./player-board-layout.system";
import { AnimalColors } from "../../consts/tile-colors";
import { MovePart } from "../../components/move-part";

export const RenderCenterBoard = (container: Container, world: GameWorld) => {
  const g = new Graphics();
  container.addChild(g);

  const center = GetTopBoardCenter(world);
  world.center.tileStock.forEach((tile, i) => {
    const real = boardCoordsToReal(new Point((i - 1.5) * 2.4, 1));
    real.x += center.x;
    const unselected = world.movePart === MovePart.PlaceTile && world.lastPickup?.tile !== tile;
    drawCenterHex(g, tile, real, unselected);
  });

  world.center.animalStock.forEach((animal, i) => {
    const real = boardCoordsToReal(new Point((i - 1.5) * 2.4, 1));
    real.x += center.x;
    g.circle(real.x, real.y + HEX_SIZE * 2, PLACED_ANIMAL_R)
      .fill(AnimalColors[animal])
      .stroke({ width: 2, color: "#000a" });
  });
  g.rect(0, PLAYER_BOARD_TOP, world.windowSize.width, 1).stroke(0);
};

export function GetTopBoardCenter(world: GameWorld) {
  return new Point(world.windowSize.width / 2, 0);
}
