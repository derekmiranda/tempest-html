import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { Level } from "./Level";

export interface EnemyPropsInterface extends GameObjectPropsInterface {
  speed?: number;
  level?: Level;
}

export class Enemy extends BaseGameObject implements GameObjectInterface {
  level: Level;
  points: Point[];
  spotIdx: number;
  to: Point;
  from: Point;
  color: string;
  speed: number;
  score: number = 0;

  constructor(props: EnemyPropsInterface) {
    super(props);
    if (props.speed) this.speed = props.speed;
  }

  updatePath(from: Point, to: Point) {
    this.to = to;
    this.from = from;
  }

  updateSpotIdx(spotIdx: number) {
    this.spotIdx = spotIdx;
  }

  setLevel(level: Level) {
    this.level = level;
  }
}
