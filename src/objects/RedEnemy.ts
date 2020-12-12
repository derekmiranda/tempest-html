import { Point } from "../types";
import { COLORS, LEVEL_CENTER } from "../CONSTS";
import { Level } from "./Level";
import { Enemy, EnemyPropsInterface } from "./Enemy";
import { findPointBetweenPoints, sleep } from "../lib/utils";
import { farDot } from "../lib/shapes";

export class RedEnemy extends Enemy {
  color: string = COLORS.RED;
  speed: number;
  level: Level;
  points: Point[];
  to: Point;
  from: Point;
  moving: boolean;

  constructor(props: EnemyPropsInterface) {
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

  calcFarPoint(): Point {
    // range from 0.2 to 0.8
    const distAwayFromLine = 0.8 - 0.6 * Math.min(1, this.transform.z - 1);
    return {
      x: LEVEL_CENTER.x + (this.to.x - LEVEL_CENTER.x) * distAwayFromLine,
      y: LEVEL_CENTER.y + (this.to.y - LEVEL_CENTER.y) * distAwayFromLine,
    };
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
    await sleep(this.randomWaitTime());
    if (this.rendered && this.transform.z > 0.3) {
      this.level.moveEnemy(this, 1);
      this.startMoveCoroutine();
    } else {
      this.moving = false;
    }
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

  setRenderedState(state: boolean) {
    this.rendered = state;

    if (state && !this.moving) {
      this.startMoveCoroutine();
    }
  }
}
