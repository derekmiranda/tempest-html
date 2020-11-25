import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { COLORS, BULLET_SPEED, RED_ENEMY_SPEED } from "../CONSTS";
import { Level } from "./Level";
import { Enemy } from "./Enemy";
import { findPointBetweenPoints } from "../lib/utils";

export class RedEnemy extends Enemy {
  color: string = COLORS.RED;
  speed: number = RED_ENEMY_SPEED;
  level: Level;
  points: Point[];
  to: Point;
  from: Point;

  constructor(props: GameObjectPropsInterface) {
    super(props);
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
    // console.log("tf z", this.transform.z);
    // console.log("z", z);
    const newZ = z - timeDelta * this.speed;

    if (newZ < 0) {
      this.destroy();
      return;
    }

    const newPoint = findPointBetweenPoints(this.from, this.to, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }
}
