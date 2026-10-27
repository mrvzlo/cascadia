import { PointData, Graphics, Point } from "pixi.js";
import { PLACED_ANIMAL_R, UNPLACE_ANIMAL_R } from "../../consts/sizes";
import { animalTextures } from "./textures";

const animalColors = ["#b67034", "#412416", "#5a7ed7", "#996bbf", "#aa9977"];

export function drawAnimal(offset: PointData, animal: number, useTexture: boolean) {
  const g = new Graphics();
  g.circle(0, 0, PLACED_ANIMAL_R);
  g.fill(useTexture ? animalTextures[animal] : animalColors[animal]);
  g.stroke({ width: 2, color: "#000a" });
  g.x = offset.x;
  g.y = offset.y;
  return g;
}

export function drawAnimalsOnTile(g: Graphics, animals: number[], occupied = false) {
  const colors = animals.map((x) => animalColors[x]);
  const offsets = getAnimalsOffset(colors.length);
  if (offsets.length !== colors.length) return;
  colors.forEach((color, i) => {
    g.circle(offsets[i].x, offsets[i].y, occupied ? PLACED_ANIMAL_R : UNPLACE_ANIMAL_R)
      .fill(color)
      .stroke({ width: 2, color: "#000a" });
  });
}

export function getAnimalsOffset(count: number) {
  if (count === 1) return [new Point(0, 0)];
  if (count === 2) return [new Point(-11, 0), new Point(11, 0)];
  if (count === 3) return [new Point(-11, -7), new Point(11, -7), new Point(0, 12)];
  return [];
}
