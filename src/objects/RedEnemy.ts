import { Point } from "../types";
import { ENEMY_BULLET_SIZE, COLORS, LEVEL_CENTER } from "../CONSTS";
import { Level } from "./Level";
import { Enemy, EnemyPropsInterface } from "./Enemy";
import {
  findPointBetweenPoints,
  shouldMoveForwardInLoop,
  sleep,
} from "../lib/utils";
import { farDot } from "../lib/shapes";
import { EnemyBullet } from "./EnemyBullet";

export class RedEnemy extends Enemy {
  static maxFollows: number = 5;
  color: string = COLORS.RED;
  speed: number;
  level: Level;
  points: Point[];
  to: Point;
  from: Point;
  moving: boolean;
  score: number = 1000;
  numFollows: number = 0;

  constructor(props: EnemyPropsInterface) {
    super(props);
  }

  async startMoveCoroutine() {
    this.moving = true;
    await sleep(this.randomMoveWaitTime());
    if (this.rendered && this.transform.z > 0.3) {
      this.level.moveEnemy(this, 1);
      this.startMoveCoroutine();
    } else {
      this.moving = false;
    }
  }

  async startPlayerFollowCoroutine() {
    this.moving = true;
    await sleep(500);
    if (this.rendered && this.numFollows < RedEnemy.maxFollows) {
      if (this.spotIdx !== this.level.playerSpotIdx) {
        this.numFollows++;

        const move = shouldMoveForwardInLoop(
          this.spotIdx,
          this.level.playerSpotIdx,
          this.level.playerSpots.length
        )
          ? 1
          : -1;
        this.level.moveEnemy(this, move);
      }
      this.startPlayerFollowCoroutine();
    } else {
      this.level.removeEnemy(this);
      this.moving = false;
      this.rendered = false;
    }
  }

  async startFireCoroutine() {
    await sleep(this.randomFireWaitTime());
    if (this.rendered) {
      if (this.transform.z > 0.5 && this.transform.z < 1) this.spawnBullet();
      this.startFireCoroutine();
    }
  }

  spawnBullet() {
    const bullet = new EnemyBullet({
      ...this.game.getDefaultProps(),
      x: this.transform.x,
      y: this.transform.y,
      z: this.transform.z + ENEMY_BULLET_SIZE,
      w: ENEMY_BULLET_SIZE,
      h: ENEMY_BULLET_SIZE,
    });
    this.level.addEnemy(bullet, this.spotIdx);
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
    if (this.onNearPlane) return;

    const { z } = this.transform.getTransformProps();
    const newZ = z - timeDelta * this.speed;

    if (newZ < 0) {
      this.updateOnNearPlane(true);
      this.startPlayerFollowCoroutine();
      return;
    }

    const newPoint = findPointBetweenPoints(this.from, this.to, newZ);
    this.setTransformWithProps({ z: newZ, ...newPoint });
  }

  randomMoveWaitTime(): number {
    return 1000 - 500 * Math.random();
  }

  // more variance
  randomFireWaitTime(): number {
    return 2000 * Math.random();
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
      this.startFireCoroutine();
    }
  }
}
