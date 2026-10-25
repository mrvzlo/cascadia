import AnimalTile from "./animal-tile";
import { HexTile } from "./hex-tile";

export interface CenterBoard {
  animalStock: AnimalTile[];
  animalShuffled: AnimalTile[];
  tileStock: HexTile[];
  tileShuffled: HexTile[];
  discarded: number[];
}
