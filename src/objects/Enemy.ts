import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { Level } from "./Level";

export interface EnemyPropsInterface extends GameObjectPropsInterface {
  speed?: number;
}

export class Enemy extends BaseGameObject implements GameObjectInterface {
  level: Level;
  points: Point[];
  to: Point;
  from: Point;
  color: string;
  speed: number;

  constructor(props: EnemyPropsInterface) {
    super(props);
    if (props.speed) this.speed = props.speed;
  }

  updatePath(to: Point, from: Point) {
    this.to = to;
    this.from = from;
  }

  setLevel(level: Level) {
    this.level = level;
  }
}
