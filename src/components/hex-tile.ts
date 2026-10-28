import { TilePairType } from "../consts/enums/animal-tile-pair.type";

export interface HexTile {
  animals: TilePairType[];
  bioms: TilePairType[];
  rotation?: number;

  id: string;
  hitboxId?: string;
}
