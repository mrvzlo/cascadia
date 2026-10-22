import { Graphics, Point, PointData } from "pixi.js";
import { Tile } from "../../components/tile";
import { HEX_SIZE, PLACED_ANIMAL_R, UNPLACE_ANIMAL_R } from "../../consts/sizes";
import { TerrainColors, AnimalColors } from "../../consts/tile-colors";
import { PlacedTile } from "../../components/placed-tile";

export function drawCenterHex(g: Graphics, tile: Tile, offset: Point) {
  const colors = tile.bioms.map((x) => TerrainColors[x]);
  drawHex(g, colors, 0, offset, HEX_SIZE);
  drawAnimals(g, offset, tile.animals);
}

export function drawPlayerHex(g: Graphics, tile: PlacedTile, offset: Point) {
  const colors = tile.bioms.map((x) => TerrainColors[x]);
  drawHex(g, colors, tile.rotation ?? 0, offset, HEX_SIZE);
  tile.occupied !== undefined ? drawAnimals(g, offset, [tile.occupied], true) : drawAnimals(g, offset, tile.animals);
}

export function drawEmptyHex(g: Graphics, offset: Point, faded: boolean) {
  drawHex(g, [faded ? "#ddd1" : "#ddd7"], 0, offset, HEX_SIZE * 0.8, false);
}

function drawHex(g: Graphics, colors: string[], rotation: number, offset: Point, size: number, stroke = true) {
  const vertices = Array.from({ length: 6 }, (_, i): PointData => {
    const angle = ((-1.5 + (i + rotation)) * Math.PI) / 3;
    return {
      x: offset.x + size * Math.cos(angle),
      y: offset.y + size * Math.sin(angle),
    };
  });

  if (stroke) strokePolygon(g, vertices);
  if (colors.length === 1) {
    drawPolygon(g, vertices, colors[0]);
  } else {
    const r = rotation % 6;
    const firstHalf = [0, 1, 2, 3].map((i) => vertices[(r + i) % 6]);
    const secondHalf = [0, 5, 4, 3].map((i) => vertices[(r + i) % 6]);

    drawPolygon(g, firstHalf, colors[0]);
    drawPolygon(g, secondHalf, colors[1]);
  }
}

export function drawAnimals(g: Graphics, center: Point, list: number[], occupied = false) {
  const offsets = getAnimalsOffset(list.length);
  if (offsets.length !== list.length) return;
  list.forEach((color, i) => {
    g.circle(center.x + offsets[i].x, center.y + offsets[i].y, occupied ? PLACED_ANIMAL_R : UNPLACE_ANIMAL_R)
      .fill(AnimalColors[color])
      .stroke({ width: 2, color: "#000a" });
  });
}

export function getAnimalsOffset(count: number) {
  if (count === 1) return [new Point(0, 0)];
  if (count === 2) return [new Point(-8, 0), new Point(-8, 0)];
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
