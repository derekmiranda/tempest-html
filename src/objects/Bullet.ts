import { BaseGameObject } from "./BaseGameObject";
import {
  GameObjectInterface,
  GameObjectPropsInterface,
  Point,
  Traveler,
} from "../types";
import { COLORS, BULLET_SPEED, COLLISION_TOLERANCE } from "../CONSTS";
import { circle } from "../lib/shapes";
import { findPointBetweenPoints } from "../lib/utils";
import { Level } from "./Level";
import { Enemy } from "./Enemy";

interface BulletPropsInterface extends GameObjectPropsInterface, Traveler {
  laneIdx: number;
  level: Level;
}

export class Bullet extends BaseGameObject implements GameObjectInterface {
  speed: number = BULLET_SPEED;
  color: string = COLORS.PLAYER;
  laneIdx: number;
  level: Level;
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

    // if reached far end
    if (newZ > 1) {
      this.destroy();
      return;
    }
    // if collided with enemy or enemy bullet
    let collidedEnemy;
    if ((collidedEnemy = this.findCollidedEnemy())) {
      collidedEnemy.destroy();
      this.destroy();
      return;
    }

    const newPoint = findPointBetweenPoints(this.to, this.from, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  findCollidedEnemy(): Enemy | null {
    const enemies = this.level.getEnemiesInLane(this.laneIdx);
    const foundEnemy =
      enemies &&
      Object.values(enemies).find((enemy: Enemy) => {
        // enemy close enough to bullet
        return (
          Math.abs(enemy.transform.z - this.transform.z) < COLLISION_TOLERANCE
        );
      });
    return foundEnemy || null;
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
