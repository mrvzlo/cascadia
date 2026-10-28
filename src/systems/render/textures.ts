import { FillPattern, Texture, Assets } from "pixi.js";
import { TilePairType } from "../../consts/enums/animal-tile-pair.type";

export const terrainPatterns: FillPattern[] = [];
export const animalTextures: Texture[] = [];
export const controlTextures: Texture[] = [];

export async function prepareTextures() {
  const files = getFiles();
  const terrains = await loadTextures(files.terrainFiles);
  const animals = await loadTextures(files.animalFiles);
  const controls = await loadTextures(["./assets/q.png", "./assets/e.png", "./assets/cancel.png"]);
  for (let i = 0; i < terrains.length; i++) {
    terrainPatterns[i] = new FillPattern(terrains[i], "repeat");
    terrainPatterns[i].transform.scale(terrains[i].width, terrains[i].height);
  }

  animals.forEach((x, i) => (animalTextures[i] = x));
  controls.forEach((x, i) => (controlTextures[i] = x));
}

function getFiles() {
  const terrainFiles = [];
  const animalFiles = [];
  terrainFiles[TilePairType.Empty] = "./assets/empty.png";
  terrainFiles[TilePairType.BearForest] = "./assets/forest.png";
  terrainFiles[TilePairType.FoxLawn] = "./assets/lawn.png";
  terrainFiles[TilePairType.BirdMountain] = "./assets/mountain.png";
  terrainFiles[TilePairType.ElkStepe] = "./assets/stepe.png";
  terrainFiles[TilePairType.FishSea] = "./assets/water.png";

  animalFiles[TilePairType.Empty] = "./assets/empty.png";
  animalFiles[TilePairType.BearForest] = "./assets/bear.png";
  animalFiles[TilePairType.FoxLawn] = "./assets/fox.png";
  animalFiles[TilePairType.BirdMountain] = "./assets/bird.png";
  animalFiles[TilePairType.ElkStepe] = "./assets/elk.png";
  animalFiles[TilePairType.FishSea] = "./assets/fish.png";
  return { terrainFiles, animalFiles };
}

export function loadTextures(names: string[]) {
  return Promise.all(names.map((x) => Assets.load<Texture>(x)));
}
