import { Graphics, Point, PointData } from "pixi.js";
import { Tile } from "../../components/tile";
import { HEX_SIZE, PLACED_ANIMAL_R, UNPLACE_ANIMAL_R } from "../../consts/sizes";
import { TerrainColors, AnimalColors } from "../../consts/tile-colors";
import { PlacedTile } from "../../components/placed-tile";

const sins = [0, Math.sin(Math.PI / 3), Math.sin((2 * Math.PI) / 3), 0, Math.sin((4 * Math.PI) / 3), Math.sin((5 * Math.PI) / 3)];
const coss = [1, Math.cos(Math.PI / 3), Math.cos((2 * Math.PI) / 3), -1, Math.cos((4 * Math.PI) / 3), Math.cos((5 * Math.PI) / 3)];

export function drawCenterHex(g: Graphics, tile: Tile, offset: Point, dim = false) {
  const alpha = dim ? "2" : "";
  const colors = tile.bioms.map((x) => TerrainColors[x] + alpha);
  drawHex(g, colors, tile.rotation ?? 0, offset, HEX_SIZE);
  const animalColors = tile.animals.map((x) => AnimalColors[x] + alpha);
  drawAnimals(g, offset, animalColors);
}

export function drawPlayerHex(g: Graphics, tile: PlacedTile, offset: Point) {
  const tileColors = tile.bioms.map((x) => TerrainColors[x]);
  drawHex(g, tileColors, tile.rotation ?? 0, offset, HEX_SIZE);
  const isOccupied = tile.occupied !== undefined;
  const animalColors = (isOccupied ? [tile.occupied!] : tile.animals).map((x) => AnimalColors[x]);
  drawAnimals(g, offset, animalColors, isOccupied);
}

export function drawEmptyHex(g: Graphics, offset: Point, faded: boolean) {
  drawHex(g, [faded ? "#ddd1" : "#ddd7"], 0, offset, HEX_SIZE * 0.8, false);
}

function drawHex(g: Graphics, colors: string[], rotation: number, offset: Point, size: number, stroke = true) {
  const vertices = Array.from({ length: 6 }, (_, i): PointData => {
    return {
      x: offset.x + size * sins[(i + rotation) % 6],
      y: offset.y + size * coss[(i + rotation) % 6],
    };
  });

  if (stroke) strokePolygon(g, vertices);
  if (colors.length === 1) {
    drawPolygon(g, vertices, colors[0]);
  } else {
    const firstHalf = [0, 1, 2, 3].map((i) => vertices[i]);
    const secondHalf = [0, 5, 4, 3].map((i) => vertices[i]);

    drawPolygon(g, firstHalf, colors[0]);
    drawPolygon(g, secondHalf, colors[1]);
  }
}

export function drawAnimals(g: Graphics, center: Point, colors: string[], occupied = false) {
  const offsets = getAnimalsOffset(colors.length);
  if (offsets.length !== colors.length) return;
  colors.forEach((color, i) => {
    g.circle(center.x + offsets[i].x, center.y + offsets[i].y, occupied ? PLACED_ANIMAL_R : UNPLACE_ANIMAL_R)
      .fill(color)
      .stroke({ width: 2, color: "#000a" });
  });
}

export function getAnimalsOffset(count: number) {
  if (count === 1) return [new Point(0, 0)];
  if (count === 2) return [new Point(-8, 0), new Point(8, 0)];
  if (count === 3) return [new Point(-7, -5), new Point(7, -5), new Point(0, 7)];
  return [];
}

function drawPolygon(g: Graphics, points: PointData[], color: string) {
  g.poly(points, true);
  g.fill(color);
}

function strokePolygon(g: Graphics, points: PointData[]) {
  g.poly(points, true);
  g.stroke({ width: 3, color: "#000a" });
}
