import Hitbox from "./hitbox";
import { HexTile } from "./hex-tile";
import AnimalTile from "./animal-tile";

export default interface Pickup {
  tile: HexTile;
  tileIndex: number;
  animal: AnimalTile;
  animalIndex: number;

  tileHitbox: Hitbox;
  animalHitbox?: Hitbox;
}
