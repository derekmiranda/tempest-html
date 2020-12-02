import { BaseGameObject } from "./BaseGameObject";
import {
  GameObjectInterface,
  GameObjectPropsInterface,
  Point,
  Traveler,
} from "../types";
import { COLORS, BULLET_SPEED, COLLISION_TOLERANCE } from "../CONSTS";
import { circle } from "../lib/shapes";
import { findPointBetweenPoints, renderPoints } from "../lib/utils";
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

    const newPoint = findPointBetweenPoints(this.to, this.from, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  render() {
    renderPoints(this);
  }
}
