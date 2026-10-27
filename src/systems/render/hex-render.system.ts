import { Graphics, Point, PointData } from "pixi.js";
import { HexTile } from "../../components/hex-tile";
import { HEX_SIZE } from "../../consts/sizes";
import { PlacedTile } from "../../components/placed-tile";
import { drawAnimalsOnTile } from "./animal-render.system";
import { terrainPatterns } from "./textures";

const sins = [0, Math.sin(Math.PI / 3), Math.sin((2 * Math.PI) / 3), 0, Math.sin((4 * Math.PI) / 3), Math.sin((5 * Math.PI) / 3)];
const coss = [1, Math.cos(Math.PI / 3), Math.cos((2 * Math.PI) / 3), -1, Math.cos((4 * Math.PI) / 3), Math.cos((5 * Math.PI) / 3)];
const vertices = Array.from({ length: 6 }, (_, i) => new Point(HEX_SIZE * sins[i % 6], HEX_SIZE * coss[i % 6]));

export function drawCenterHex(tile: HexTile, offset: PointData): Graphics {
  const g = new Graphics();
  drawHex(g, tile.bioms);
  drawAnimalsOnTile(g, tile.animals);
  g.position = offset;
  g.rotation = rotationToDeg(tile.rotation);
  return g;
}

export function drawPlayerHex(tile: PlacedTile, offset: PointData): Graphics {
  const g = new Graphics();
  drawHex(g, tile.bioms);
  const isOccupied = tile.occupied !== undefined;
  drawAnimalsOnTile(g, isOccupied ? [tile.occupied!] : tile.animals, isOccupied);
  g.position = offset;
  g.rotation = rotationToDeg(tile.rotation);
  return g;
}

export const rotationToDeg = (x?: number) => (Math.PI / 3) * -(x ?? 0);

export function drawEmptyHex(offset: PointData): Graphics {
  const g = new Graphics();
  drawHex(g, [5], false);
  g.position = offset;
  g.alpha = 0.4;
  g.scale.set(0.5);
  return g;
}

function drawHex(g: Graphics, colors: number[], stroke = true) {
  if (stroke) strokePolygon(g, vertices);
  const firstHalf = [0, 1, 2, 3].map((i) => vertices[i]);
  const secondHalf = [0, 5, 4, 3].map((i) => vertices[i]);
  drawPolygon(g, firstHalf, colors[0]);
  drawPolygon(g, secondHalf, colors[1] ?? colors[0]);
}

function drawPolygon(g: Graphics, points: PointData[], color: number) {
  g.poly(points, true).fill({ fill: terrainPatterns[color], textureSpace: "global" });
}

function strokePolygon(g: Graphics, points: PointData[]) {
  g.poly(points, true).stroke({ width: 2, color: "#222" });
}
