import { Point } from "pixi.js";
import GameWorld from "../../components/game-world";
import Map2D from "../../helpers/map2d";

export function getAvailableMoves(world: GameWorld) {
  const tiles = world.player.tiles;
  const freePlaces = new Map2D<Point>();
  tiles.getAll().forEach((tile) =>
    HexNeighboors.forEach((near) => {
      const newTile = sum(tile.point, near);
      if (tiles.has(newTile) || freePlaces.has(newTile)) return;
      freePlaces.set(newTile, newTile);
    }),
  );
  return freePlaces.getAll();
}

function sum(a: Point, b: Point) {
  return new Point(a.x + b.x, a.y + b.y);
}

export const HexNeighboors = [new Point(-2, 0), new Point(2, 0), new Point(-1, -1), new Point(-1, 1), new Point(+1, -1), new Point(+1, 1)];
