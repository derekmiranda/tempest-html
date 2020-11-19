import { Point } from "./types";

// define geometry as relative to unit square
export const LEVEL_CENTER: Point = {
  x: 0,
  y: 0.1,
};

// scale to apply on far level shape
export const FAR_SCALE = 0.2;
export const Z_SCALE = Math.sqrt(0.2);

// padding b/w player and line on level w.r.t. level-space
export const PLAYER_TO_LEVEL_DIST: number = 0.1;

export const COLORS = {
  BG: "black",
  PLAYER: "yellow",
  BULLET: "pink",
  RED: "tomato",
  LINE: "blue",
};
