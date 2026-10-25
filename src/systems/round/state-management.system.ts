import GameWorld from "../../components/game-world";
import { GameElementType } from "../../consts/enums/game-element.type";
import { GameStateType } from "../../consts/enums/game-state.type";

const semiTrans = 0.4;

export function checkElementActiveState(state: GameStateType, element: GameElementType) {
  switch (state) {
    case GameStateType.PickTile:
      return element === GameElementType.StockTile;
    case GameStateType.PlaceTile:
      return element === GameElementType.EdgeTile;
    case GameStateType.PickAnimal:
      return element === GameElementType.StockAnimal;
    case GameStateType.PlaceAnimal:
      return element === GameElementType.BoardTile;
  }
}
export function setGameStateToPickTile(world: GameWorld) {
  world.gameState = GameStateType.PickTile;
  world.center.tileStock.forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 1));
  world.center.animalStock.forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 1));
  world.player.edges.getAll().forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 0.1));
}

export function setGameStateToPlaceTile(world: GameWorld) {
  world.gameState = GameStateType.PlaceTile;
  world.center.tileStock.forEach(
    (x, i) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = world.lastPickup?.tileIndex === i ? 1 : semiTrans),
  );
  world.center.animalStock.forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = semiTrans));
  world.player.edges.getAll().forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 0.4));
}

export function setGameStateToPickAnimal(world: GameWorld) {
  world.gameState = GameStateType.PickAnimal;
  world.center.tileStock.forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = semiTrans));
  world.center.animalStock.forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 1));
  world.player.edges.getAll().forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 0.1));
}

export function setGameStateToPlaceAnimal(world: GameWorld) {
  world.gameState = GameStateType.PlaceAnimal;
  world.center.tileStock.forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = semiTrans));
  world.center.animalStock.forEach(
    (x, i) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = world.lastPickup?.animalIndex === i ? 1 : semiTrans),
  );
  world.player.edges.getAll().forEach((x) => (world.hitboxes.get(x.hitboxId!)!.graphics.alpha = 0.1));
}
