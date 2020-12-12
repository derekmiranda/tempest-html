import { BaseGameObject } from "./BaseGameObject";
import {
  GameObjectInterface,
  GameObjectPropsInterface,
  Point,
  Traveler,
} from "../types";
import { COLORS, ENEMY_BULLET_SPEED } from "../CONSTS";
import { circle } from "../lib/shapes";
import { findPointBetweenPoints, renderPoints } from "../lib/utils";
import { Level } from "./Level";
import { Enemy, EnemyPropsInterface } from "./Enemy";

export class EnemyBullet extends Enemy {
  speed: number = ENEMY_BULLET_SPEED;
  color: string = COLORS.RED;
  laneIdx: number;
  level: Level;
  points: Point[];
  to: Point;
  from: Point;

  constructor(props: EnemyPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = circle(4);
  }

  update(timeDelta: number) {
    const { z } = this.transform.getTransformProps();
    const newZ = z - timeDelta * this.speed;

    if (newZ < 0) {
      this.level.removeEnemy(this);
      this.rendered = false;
      return;
    }

    const newPoint = findPointBetweenPoints(this.from, this.to, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  render() {
    renderPoints(this);
  }
}
