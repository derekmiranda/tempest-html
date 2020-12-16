import { Point } from "./types";

// 60 fps
export const AVG_FRAME_TIME = 1 / 60;

// define geometry as relative to unit square
export const LEVEL_CENTER: Point = {
  x: 0,
  y: 0.1,
};

// scale to apply on far level shape
export const FAR_SCALE = 0.1;

// padding b/w player and line on level w.r.t. level-space
export const PLAYER_TO_LEVEL_DIST = 0;
export const PLAYER_TO_LEVEL_SIZE = 0.2;
export const RED_ENEMY_SIZE = 0.2;
export const ENEMY_BULLET_SIZE = 0.05;
export const BULLET_SIZE = 0.05;

// z-value tolerance for collisions
export const COLLISION_TOLERANCE = 0.03;

export const COLORS = {
  BG: "black",
  PLAYER: "yellow",
  EXPLOSION1: "white",
  EXPLOSION2: "yellow",
  EXPLOSION3: "tomato",
  RED: "tomato",
  LINE: "blue",
  TEXT: "white",
  // for title animation
  TITLE_ANIM: [
    "magenta",
    "coral",
    "gold",
    "mediumspringgreen",
    "mediumslateblue",
    "white",
  ],
};

export const RED_ENEMY_SPEED = 0.00015;
export const BULLET_SPEED = 0.003;
export const ENEMY_BULLET_SPEED = 0.0005;
export const BULLET_TOLERANCE = 1500 * BULLET_SPEED * AVG_FRAME_TIME;
export const NEAR_BULLET_TOLERANCE = BULLET_TOLERANCE * 5;
export const GAME_OVER_ANIM_SPEED = 0.0015;

export const MAX_ID = Number.MAX_SAFE_INTEGER;
