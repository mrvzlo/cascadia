import { PlacedTile } from "./placed-tile";
import Map2D from "../helpers/map2d";

export default interface PlayerBoard {
  tiles: Map2D<PlacedTile>;
  score: number;
  animalScore: number[];
  terrainScore: number[];
}
