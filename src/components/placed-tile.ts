import { HexTile } from "./hex-tile";
import { Coords } from "./coords";

export interface PlacedTile extends HexTile {
  occupied?: number;
  coords: Coords;
}
