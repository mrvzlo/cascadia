import { Container, Graphics, Point, Text, TextStyleOptions } from "pixi.js";
import { setTerrainScore } from "../scoring/terrain-score.system";
import { drawAnimals, drawPlayerHex } from "./hex-render.system";
import GameWorld from "../../components/game-world";
import { HEX_SIZE, SQRT3 } from "../../consts/sizes";
import PlayerBoard from "../../components/player-board";
import { AnimalColors } from "../../consts/tile-colors";

export function RenderPlayerScore(container: Container, world: GameWorld) {
  const g = new Graphics();
  container.addChild(g);
  setScore(world.player);
  const scores = [...world.player.terrainScore];
  scores.push(world.player.score);
  for (let i = 0; i < scores.length; i++) {
    const p = new Point(
      world.windowSize.width - HEX_SIZE - ((i % 2) * HEX_SIZE * SQRT3) / 2,
      world.windowSize.height - HEX_SIZE * (i + 1) * 1.5,
    );

    drawPlayerHex(g, { point: new Point(0), bioms: [i], animals: [] }, p);
    addText(scores[i] + "", p, container);
  }
  for (let i = 0; i < world.player.animalScore.length; i++) {
    const p = new Point(
      world.windowSize.width - HEX_SIZE - (((i % 2) + 2) * HEX_SIZE * SQRT3) / 2,
      world.windowSize.height - HEX_SIZE * (i + 1) * 1.5,
    );

    drawAnimals(g, p, [AnimalColors[i]], true);
    addText(world.player.animalScore[i] + "", p, container);
  }
}

function addText(text: string, point: Point, container: Container) {
  const style: TextStyleOptions = { fontSize: 32, fill: 0xeeeeee, fontWeight: "bold", dropShadow: { color: 0, blur: 6, distance: 0 } };
  const score = new Text({ text, style });
  score.x = point.x - score.width / 2;
  score.y = point.y - score.height / 2;
  container.addChild(score);
}

function setScore(player: PlayerBoard) {
  setTerrainScore(player);
  player.score = player.animalScore.reduce((a, b) => a + b, 0) + player.terrainScore.reduce((a, b) => a + b, 0);
}
