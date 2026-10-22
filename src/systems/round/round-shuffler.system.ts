import GameWorld from "../../components/game-world";

export function AddCenterTiles(gameWorld: GameWorld) {
  let allSame = true;

  while (allSame) {
    while (gameWorld.center.animalStock.length < 4) {
      if (!gameWorld.center.animalShuffled.length) return;
      gameWorld.center.animalStock.push(gameWorld.center.animalShuffled.pop()!);
    }
    while (gameWorld.center.tileStock.length < 4) {
      if (!gameWorld.center.tileShuffled.length) return;
      gameWorld.center.tileStock.push(gameWorld.center.tileShuffled.pop()!);
    }

    for (let i = 1; i < gameWorld.center.animalStock.length; i++)
      allSame &&= gameWorld.center.animalStock[i] === gameWorld.center.animalStock[0];
    if (allSame) gameWorld.center.animalStock = [];
  }
}
