import { Application } from "pixi.js";
import { setupClickHandling } from "./ux/click-handler";
import { SetupGame } from "./systems/game-setup.system";
import { AddCenterTiles } from "./systems/round/stock-shuffler.system";
import { prepareTextures } from "./systems/render/textures";
import { setGameStateToPickTile } from "./systems/round/state-management.system";

export async function runApp() {
  console.time("start");
  const app = new Application();
  await app.init({
    backgroundAlpha: 0,
    resizeTo: window,
    autoDensity: true,
    antialias: true,
  });
  document.body.appendChild(app.canvas);
  await prepareTextures();
  console.timeEnd("start");
  const world = SetupGame(app);
  setupClickHandling(app, world);
  setGameStateToPickTile(world);
  await AddCenterTiles(world);
}

runApp();
