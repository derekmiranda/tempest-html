import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { LEVEL_CENTER } from "../CONSTS";
import { Level } from "./Level";
import { findPointBetweenPoints } from "../lib/utils";
import { farDot } from "../lib/shapes";

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

  calcFarPoint(): Point {
    // range from 0.2 to 0.8
    const distAwayFromLine = 0.8 - 0.6 * Math.min(1, this.transform.z - 1);
    return {
      x: LEVEL_CENTER.x + (this.to.x - LEVEL_CENTER.x) * distAwayFromLine,
      y: LEVEL_CENTER.y + (this.to.y - LEVEL_CENTER.y) * distAwayFromLine,
    };
  }

  render() {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    // render far shape
    if (this.transform.z > 1) {
      const farPoints = farDot(this.calcFarPoint());
      farPoints.forEach(({ x, y }, i) => {
        i === 0 ? this.level.localMoveTo(x, y) : this.level.localLineTo(x, y);
      });
    } else {
      this.points.forEach(({ x, y }, i) => {
        i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
      });
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
