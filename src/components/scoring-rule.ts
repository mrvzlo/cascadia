import PlayerBoard from "./player-board";

export type ScoringRule = (board: PlayerBoard) => number;
