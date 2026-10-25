import { PlacedTile } from "./placed-tile";
import Map2D from "../helpers/map2d";
import { EdgeTile } from "./edge-tile";

export default interface PlayerBoard {
  tiles: Map2D<PlacedTile>;
  edges: Map2D<EdgeTile>;
  score: number;
  animalScore: number[];
  terrainScore: number[];
  bonusScore: number;
}
