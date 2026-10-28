import { HexTile } from "./hex-tile";
import { Coords } from "./coords";
import { TilePairType } from "../consts/enums/animal-tile-pair.type";

export interface PlacedTile extends HexTile {
  occupied: TilePairType;
  coords: Coords;
}
