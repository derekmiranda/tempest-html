import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { COLORS, BULLET_SPEED, RED_ENEMY_SPEED } from "../CONSTS";
import { Level } from "./Level";
import { Enemy } from "./Enemy";
import { findPointBetweenPoints, sleep } from "../lib/utils";

export class RedEnemy extends Enemy {
  color: string = COLORS.RED;
  speed: number = RED_ENEMY_SPEED;
  level: Level;
  points: Point[];
  to: Point;
  from: Point;
  moving: boolean;

  constructor(props: GameObjectPropsInterface) {
    super(props);
    this.startMoveCoroutine();
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
      this.level.removeEnemy(this);
      this.rendered = false;
      return;
    }

    const newPoint = findPointBetweenPoints(this.from, this.to, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  randomWaitTime(): number {
    return 1000 - 500 * Math.random();
  }

  async startMoveCoroutine() {
    this.moving = true;
    while (this.rendered) {
      await sleep(this.randomWaitTime());
      this.level.moveEnemy(this, 1);
    }
    this.moving = false;
  }

  setRenderedState(state: boolean) {
    this.rendered = state;

    if (state && !this.moving) {
      this.startMoveCoroutine();
    }
  }
}
