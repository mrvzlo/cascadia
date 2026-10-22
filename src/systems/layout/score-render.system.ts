import { Container, Graphics, Point, Text, TextStyleOptions } from "pixi.js";
import { setTerrainScore } from "../round/terrain-score.system";
import { drawPlayerHex } from "./hex-render.system";
import GameWorld from "../../components/game-world";
import { HEX_SIZE } from "../../consts/sizes";

export function RenderPlayerScore(container: Container, world: GameWorld) {
  const g = new Graphics();
  container.addChild(g);
  setTerrainScore(world.player);
  for (let i = 0; i < world.player.terrainScore.length; i++) {
    const p = new Point(world.windowSize.width - HEX_SIZE, world.windowSize.height - HEX_SIZE * (i + 1) * 1.8);

    drawPlayerHex(g, { point: new Point(0), bioms: [i], animals: [] }, p);

    const style: TextStyleOptions = { fontSize: 32, fill: 0xeeeeee, fontWeight: "bold", dropShadow: { color: 0, blur: 6, distance: 0 } };
    const score = new Text({ text: world.player.terrainScore[i], style });
    score.x = p.x - score.width / 2;
    score.y = p.y - score.height / 2;
    container.addChild(score);
  }
}
