import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { COLORS, BULLET_SPEED, RED_ENEMY_SPEED } from "../CONSTS";
import { Level } from "./Level";
import { findPointBetweenPoints } from "../lib/utils";

export class Enemy extends BaseGameObject implements GameObjectInterface {
  color: string = COLORS.RED;
  speed: number = RED_ENEMY_SPEED;
  level: Level;
  points: Point[];
  to: Point;
  from: Point;

  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  setLevel(level: Level) {
    this.level = level;
  }

  updatePath(to: Point, from: Point) {
    this.to = to;
    this.from = from;
  }

  initPoints() {
    this.points = [
      // left edge
      { x: -0.5, y: -0.25 },
      { x: -0.25, y: 0 },
      { x: -0.5, y: 0.25 },
      // right edge
      { x: 0.5, y: -0.25 },
      { x: 0.25, y: 0 },
      { x: 0.5, y: 0.25 },
    ];
  }

  update(timeDelta: number) {
    const { z } = this.transform.getTransformProps();
    const newZ = z - timeDelta * this.speed;

    if (newZ < 0) {
      this.destroy();
      return;
    }

    const newPoint = findPointBetweenPoints(this.from, this.to, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  render() {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.points.forEach(({ x, y }, i) => {
      i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
    });
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
