import { Tile } from "./tile";

export default interface Pickup {
  tile: Tile;
  tileIndex: number;
  animal: number;
  animalIndex: number;
}
