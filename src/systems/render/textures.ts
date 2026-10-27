import { FillPattern, Texture, Assets } from "pixi.js";

export const terrainPatterns: FillPattern[] = [];
export const animalTextures: Texture[] = [];
export const controlTextures: Texture[] = [];

export async function prepareTextures() {
  const terrains = await loadTextures([
    "./assets/lawn.png",
    "./assets/forest.png",
    "./assets/mountain.png",
    "./assets/water.png",
    "./assets/stepe.png",
    "./assets/empty.png",
  ]);
  const animals = await loadTextures([
    "./assets/fox.png",
    "./assets/bear.png",
    "./assets/bird.png",
    "./assets/fish.png",
    "./assets/elk.png",
  ]);
  const controls = await loadTextures(["./assets/q.png", "./assets/e.png", "./assets/cancel.png"]);
  for (let i = 0; i < terrains.length; i++) {
    terrainPatterns[i] = new FillPattern(terrains[i], "repeat");
    terrainPatterns[i].transform.scale(terrains[i].width, terrains[i].height);
  }

  animals.forEach((x, i) => (animalTextures[i] = x));
  controls.forEach((x, i) => (controlTextures[i] = x));
}

export function loadTextures(names: string[]) {
  return Promise.all(names.map((x) => Assets.load<Texture>(x)));
}
