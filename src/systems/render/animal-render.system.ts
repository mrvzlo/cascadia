import { PointData, Graphics, Point } from "pixi.js";
import { PLACED_ANIMAL_R, UNPLACE_ANIMAL_R } from "../../consts/sizes";
import { animalTextures } from "./textures";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";

const animalColors: string[] = [];
animalColors[TilePairType.BearForest] = "#412416";
animalColors[TilePairType.FoxLawn] = "#b67034";
animalColors[TilePairType.BirdMountain] = "#5a7ed7";
animalColors[TilePairType.FishSea] = "#996bbf";
animalColors[TilePairType.ElkStepe] = "#aa9977";

export function drawAnimal(offset: PointData, animal: TilePairType, useTexture: boolean) {
  const g = new Graphics();
  g.circle(0, 0, PLACED_ANIMAL_R);
  g.fill(useTexture ? animalTextures[animal] : animalColors[animal]);
  g.stroke({ width: 2, color: "#000a" });
  g.x = offset.x;
  g.y = offset.y;
  return g;
}

export function drawAnimalsOnTile(g: Graphics, animals: TilePairType[], occupied = false) {
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
