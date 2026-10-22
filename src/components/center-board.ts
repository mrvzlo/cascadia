import { Tile } from "./tile";

export interface CenterBoard {
  animalStock: number[];
  animalShuffled: number[];
  tileStock: Tile[];
  tileShuffled: Tile[];
  discarded: number[];
}
