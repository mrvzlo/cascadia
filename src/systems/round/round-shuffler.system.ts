import { GameState } from "../../components/game-state";
import GameWorld from "../../components/game-world";
import { STOCK_SIZE } from "../../consts/sizes";

export function AddCenterTiles(gameWorld: GameWorld, changeState = true) {
  let allSame = true;

  while (allSame) {
    for (let i = 0; i < STOCK_SIZE; i++) {
      gameWorld.center.animalStock[i] ??= gameWorld.center.animalShuffled.pop()!;
      gameWorld.center.tileStock[i] ??= gameWorld.center.tileShuffled.pop()!;
      allSame &&= gameWorld.center.animalStock[i] === gameWorld.center.animalStock[0];
    }

    if (allSame) gameWorld.center.animalStock = [];
  }

  if (changeState) gameWorld.gameState = GameState.PickTile;
}
