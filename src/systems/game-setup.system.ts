import { Application, Point } from "pixi.js";
import { CenterBoard } from "../components/center-board";
import GameWorld from "../components/game-world";
import { PlacedTile } from "../components/placed-tile";
import PlayerBoard from "../components/player-board";
import { Tile } from "../components/tile";
import { shuffle } from "./generic/shuffle.system";
import Map2D from "../helpers/map2d";

export function SetupGame(app: Application) {
  const world: GameWorld = {
    center: setupGameBoard(),
    player: setupPlayerBoard(),
    round: 0,
    hitboxes: [],
    history: [],
    movePart: 0,
    windowSize: app.canvas,
  };
  return world;
}

function setupGameBoard() {
  const board: CenterBoard = {
    discarded: [],
    tileStock: [],
    animalStock: [],
    animalShuffled: shuffle(getAllAnimals()),
    tileShuffled: shuffle(getAllTiles()),
  };

  return board;
}

function setupPlayerBoard() {
  const board: PlayerBoard = {
    score: 0,
    animalScore: [0, 0, 0, 0, 0],
    terrainScore: [0, 0, 0, 0, 0],
    tiles: getStartingTiles(),
  };

  return board;
}

function getAllAnimals() {
  const tiles = [];
  for (let i = 0; i < 100; i++) tiles.push(i % 5);
  return tiles;
}

function getAllTiles() {
  const tiles: Tile[] = [];
  for (let i = 0; i < 5; i++) {
    tiles.push({ bioms: [i], animals: [i] });
    tiles.push({ bioms: [i], animals: [i] });
    tiles.push({ bioms: [i], animals: [(i + 3) % 5] });
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
  for (let i = 0; i < 5; i++) for (let j = 0; j < i; j++) tiles.push({ bioms: [i, j], animals: animalPairs[a++ % 10] }); // 25
  shuffle(animalPairs);
  for (let i = 0; i < 5; i++) for (let j = 0; j < i; j++) tiles.push({ bioms: [i, j], animals: animalPairs[a++ % 10] }); // 35
  shuffle(animalTrios);
  for (let i = 0; i < 5; i++) for (let j = 0; j < i; j++) tiles.push({ bioms: [i, j], animals: animalTrios[a++ % 10] }); // 45

  return tiles;
}

function getStartingTiles() {
  const terrains = [0, 1, 2, 3, 4];
  const animals = [0, 1, 2, 3, 4];
  shuffle(terrains);
  shuffle(animals);
  const top: PlacedTile = { animals: [animals[0]], rotation: 0, point: new Point(0, 0), bioms: [terrains[0]] };
  const left: PlacedTile = { animals: [animals[2], animals[1]], rotation: 2, point: new Point(-1, 1), bioms: [terrains[2], terrains[3]] };
  const right: PlacedTile = {
    animals: [animals[0], animals[3], animals[4]],
    rotation: 1,
    point: new Point(1, 1),
    bioms: [terrains[4], terrains[1]],
  };
  const map = new Map2D<PlacedTile>();
  map.set(top.point, top);
  map.set(left.point, left);
  map.set(right.point, right);
  return map;
}
