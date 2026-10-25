import { Application } from "pixi.js";
import { setupClickHandling } from "./ux/click-handler";
import { SetupGame } from "./systems/game-setup.system";
import { AddCenterTiles } from "./systems/round/round-shuffler.system";
import { prepareTextures } from "./systems/layout/hex-render.system";

export async function runApp() {
  console.time("start");
  const app = new Application();
  await app.init({
    background: "#222",
    resizeTo: window,
    autoDensity: true,
    antialias: true,
  });
  document.body.appendChild(app.canvas);
  await prepareTextures();
  console.timeEnd("start");
  const world = SetupGame(app);
  AddCenterTiles(world);
  setupClickHandling(app, world);
}

runApp();
