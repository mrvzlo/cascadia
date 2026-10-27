import { Graphics, PointData, RendererType } from "pixi.js";
import GameWorld from "../../components/game-world";
import Hitbox from "../../components/hitbox";
import { PLACED_ANIMAL_R } from "../../consts/sizes";
import { controlTextures } from "./textures";
import { getTilePointOnStock } from "./board-position.system";
import { CancelKey, EKey, QKey } from "../../consts/keys";
import { GameElementType } from "../../consts/enums/game-element.type";

export function addControls(world: GameWorld) {
  [createControlQ(world), createControlE(world), createControlCancel(world)].forEach((x) => {
    world.hitboxes.set(x.id, x);
    world.controlsContiner.addChild(x.graphics);
  });
}

function createControlQ(world: GameWorld) {
  const point = getTilePointOnStock(world, -1, 0);
  const hitbox: Hitbox = {
    point,
    r: PLACED_ANIMAL_R,
    id: QKey,
    graphics: renderControl(0, point),
    renderedOn: "",
    renderedType: GameElementType.TileControl,
  };
  return hitbox;
}

function createControlE(world: GameWorld) {
  const point = getTilePointOnStock(world, 4, 0);
  const hitbox: Hitbox = {
    point,
    r: PLACED_ANIMAL_R,
    id: EKey,
    graphics: renderControl(1, point),
    renderedOn: "",
    renderedType: GameElementType.TileControl,
  };
  return hitbox;
}

function createControlCancel(world: GameWorld) {
  const point = getTilePointOnStock(world, 4, 1);
  const hitbox: Hitbox = {
    point,
    r: PLACED_ANIMAL_R,
    id: CancelKey,
    graphics: renderControl(2, point),
    renderedOn: "",
    renderedType: GameElementType.AnimalControl,
  };
  return hitbox;
}

function renderControl(id: number, offset: PointData) {
  const g = new Graphics();
  g.circle(0, 0, PLACED_ANIMAL_R);
  g.fill(controlTextures[id]);
  g.x = offset.x;
  g.y = offset.y;
  return g;
}
