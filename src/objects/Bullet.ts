import { BaseGameObject } from "./BaseGameObject";
import {
  GameObjectInterface,
  GameObjectPropsInterface,
  Point,
  Traveler,
} from "../types";
import { COLORS, BULLET_SPEED } from "../CONSTS";
import { circle } from "../lib/shapes";
import { findPointBetweenPoints } from "../lib/utils";

interface BulletPropsInterface extends GameObjectPropsInterface, Traveler {}

export class Bullet extends BaseGameObject implements GameObjectInterface {
  speed: number = BULLET_SPEED;
  color: string = COLORS.PLAYER;
  points: Point[];
  to: Point;
  from: Point;

  constructor(props: BulletPropsInterface) {
    super(props);
    this.initPoints();
  }

  initPoints() {
    this.points = circle(4);
  }

  update(timeDelta: number) {
    const { z } = this.transform.getTransformProps();
    const newZ = z + timeDelta * BULLET_SPEED;

    if (newZ > 1) {
      this.destroy();
      return;
    }

    const newPoint = findPointBetweenPoints(this.to, this.from, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.points.forEach(({ x, y }, i) => {
      i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
    });
    this.ctx.closePath();
    this.ctx.fill();
  }
}
