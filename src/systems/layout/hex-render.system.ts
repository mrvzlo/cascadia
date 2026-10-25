import { Assets, FillPattern, Graphics, Point, PointData, Texture } from "pixi.js";
import { Tile } from "../../components/tile";
import { HEX_SIZE } from "../../consts/sizes";
import { PlacedTile } from "../../components/placed-tile";
import { drawAnimalsOnTile } from "./animal.render.system";

const sins = [0, Math.sin(Math.PI / 3), Math.sin((2 * Math.PI) / 3), 0, Math.sin((4 * Math.PI) / 3), Math.sin((5 * Math.PI) / 3)];
const coss = [1, Math.cos(Math.PI / 3), Math.cos((2 * Math.PI) / 3), -1, Math.cos((4 * Math.PI) / 3), Math.cos((5 * Math.PI) / 3)];
const vertices = Array.from({ length: 6 }, (_, i) => new Point(HEX_SIZE * sins[i % 6], HEX_SIZE * coss[i % 6]));
const fillPatterns: FillPattern[] = [];

export async function prepareTextures() {
  const images = [
    "./assets/lawn.png",
    "./assets/forest.png",
    "./assets/mountain.png",
    "./assets/water.png",
    "./assets/stepe.png",
    "./assets/empty.png",
  ];
  for (let i = 0; i < images.length; i++) {
    const texture = await Assets.load<Texture>(images[i]);
    fillPatterns[i] = new FillPattern(texture, "repeat");
    fillPatterns[i].transform.scale(texture.width, texture.height);
  }
}

export function drawCenterHex(tile: Tile, offset: PointData, dim = false): Graphics {
  const g = new Graphics();
  drawHex(g, tile.bioms);
  drawAnimalsOnTile(g, tile.animals);
  g.position = offset;
  g.alpha = dim ? 0.2 : 1;
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

export function drawEmptyHex(offset: PointData, faded: boolean): Graphics {
  const g = new Graphics();
  drawHex(g, [5], false);
  g.position = offset;
  g.alpha = faded ? 0.1 : 0.4;
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
  g.poly(points, true).fill({ fill: fillPatterns[color], textureSpace: "global" });
}

function strokePolygon(g: Graphics, points: PointData[]) {
  g.poly(points, true).stroke({ width: 2, color: "#222" });
}
