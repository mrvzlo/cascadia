import { Application, Container, Point } from "pixi.js";
import { CenterBoard } from "../components/center-board";
import GameWorld from "../components/game-world";
import { PlacedTile } from "../components/placed-tile";
import PlayerBoard from "../components/player-board";
import { HexTile } from "../components/hex-tile";
import { shuffle } from "./generic/shuffle.system";
import Map2D from "../helpers/map2d";
import { GameStateType } from "../consts/enums/game-state.type";
import { IdManager } from "../helpers/id-manager";

export function SetupGame(app: Application) {
  const idMngr = new IdManager();
  const world: GameWorld = {
    center: setupGameBoard(idMngr),
    player: setupPlayerBoard(idMngr),
    round: 0,
    hitboxes: new Map(),
    gameState: GameStateType.PickTile,
    isWaiting: false,
    windowSize: app.canvas,
    animalContainer: new Container(),
    scoreContainer: new Container(),
    tileContainer: new Container(),
    controlsContiner: new Container(),
    idMngr,
  };
  return world;
}

const setupGameBoard = (idMngr: IdManager): CenterBoard => ({
  discarded: [],
  tileStock: [],
  animalStock: [],
  animalShuffled: shuffle(getAllAnimals()),
  tileShuffled: shuffle(getAllTiles(idMngr)),
});

const setupPlayerBoard = (idMngr: IdManager): PlayerBoard => ({
  score: 0,
  animalScore: [0, 0, 0, 0, 0],
  terrainScore: [0, 0, 0, 0, 0],
  tiles: getStartingTiles(idMngr),
  edges: new Map2D(),
  bonusScore: 0,
});

function getAllAnimals() {
  const tiles: number[] = [];
  for (let i = 0; i < 50; i++) tiles.push(i % 5);
  return tiles;
}

function getAllTiles(idMngr: IdManager) {
  const tiles: HexTile[] = [];
  for (let i = 0; i < 5; i++) {
    tiles.push({ bioms: [i], id: idMngr.getNext("T"), animals: [i] });
    tiles.push({ bioms: [i], id: idMngr.getNext("T"), animals: [i] });
    tiles.push({ bioms: [i], id: idMngr.getNext("T"), animals: [(i + 3) % 5] });
  } // 15

  let a = 0;
  const animalPairs: number[][] = [];
  const animalTrios: number[][] = [];
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < i; j++) {
      animalPairs.push([i, j]);
      for (let k = 0; k < j; k++) animalTrios.push([i, j, k]);
    }

  shuffle(animalPairs);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < i; j++) tiles.push({ bioms: [i, j], id: idMngr.getNext("T"), animals: animalPairs[a++ % 10] }); // 25
  shuffle(animalPairs);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < i; j++) tiles.push({ bioms: [i, j], id: idMngr.getNext("T"), animals: animalPairs[a++ % 10] }); // 35
  shuffle(animalTrios);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < i; j++) tiles.push({ bioms: [i, j], id: idMngr.getNext("T"), animals: animalTrios[a++ % 10] }); // 45

  return tiles;
}

function getStartingTiles(idMngr: IdManager) {
  const terrains = [0, 1, 2, 3, 4];
  const animals = [0, 1, 2, 3, 4];
  shuffle(terrains);
  shuffle(animals);
  const top: PlacedTile = {
    animals: [animals[0]],
    id: idMngr.getNext("P"),
    rotation: 0,
    coords: { intX: 0, intY: 0 },
    bioms: [terrains[0]],
  };
  const left: PlacedTile = {
    animals: [animals[2], animals[1]],
    id: idMngr.getNext("P"),
    rotation: 2,
    coords: { intX: -1, intY: 1 },
    bioms: [terrains[2], terrains[3]],
  };
  const right: PlacedTile = {
    animals: [animals[0], animals[3], animals[4]],
    id: idMngr.getNext("P"),
    rotation: 1,
    coords: { intX: 1, intY: 1 },
    bioms: [terrains[4], terrains[1]],
  };
  const map = new Map2D<PlacedTile>();
  map.set(top.coords, top);
  map.set(left.coords, left);
  map.set(right.coords, right);
  return map;
}
