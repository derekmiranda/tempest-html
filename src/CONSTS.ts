import { Point } from "./types";

// define geometry as relative to unit square
export const LEVEL_CENTER: Point = {
  x: 0,
  y: 0.1,
};

// scale to apply on far level shape
export const FAR_SCALE = 0.1;

// padding b/w player and line on level w.r.t. level-space
export const PLAYER_TO_LEVEL_DIST: number = 0;
export const PLAYER_TO_LEVEL_SIZE: number = 0.2;
export const ENEMY_TO_LEVEL_SIZE: number = 0.2;

export const COLORS = {
  BG: "black",
  PLAYER: "yellow",
  BULLET: "pink",
  RED: "tomato",
  LINE: "blue",
};

export const BULLET_SPEED = 0.003;

export const MAX_ID = Number.MAX_SAFE_INTEGER;
