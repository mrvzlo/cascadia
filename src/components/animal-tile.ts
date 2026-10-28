import { TilePairType } from "../consts/enums/animal-tile-pair.type";

export default interface AnimalTile {
  value: TilePairType;
  id: string;
  hitboxId?: string;
}
