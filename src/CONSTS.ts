import { Point } from "./types";

// define geometry as relative to unit square
export const LEVEL_CENTER: Point = {
  x: 0.5,
  y: 0.6,
};

// padding b/w player and line on level w.r.t. level-space
export const PLAYER_TO_LEVEL_DIST: number = 0.05;

export const COLORS = {
  BG: "black",
  PLAYER: "yellow",
  RED: "tomato",
  LINE: "blue",
};
