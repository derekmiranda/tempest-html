import {
  GameObjectPropsInterface,
  TransformPropsInterface,
  Point,
} from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Player } from "./Player";
import { calcAngle, calcMidpoints, throttle } from "../lib/utils";
import {
  LEVEL_CENTER,
  FAR_SCALE,
  COLORS,
  ENEMY_TO_LEVEL_SIZE,
  COLLISION_TOLERANCE,
  AVG_FRAME_TIME,
  BULLET_SPEED,
  BULLET_TOLERANCE,
} from "../CONSTS";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";
import { Queue } from "../lib/Queue";
import { EnemySpawner } from "./EnemySpawner";

export interface LevelSpot extends TransformPropsInterface {}

export interface LevelPropsInterface extends GameObjectPropsInterface {
  loops?: boolean;
}

interface EnemyStateMap {
  [id: string]: EnemyState;
}

interface EnemyLaneMap {
  [laneIdx: string]: Queue<Enemy>;
}

interface BulletLaneMap {
  [laneIdx: string]: Queue<Bullet>;
}

interface EnemyState {
  enemy: Enemy;
  spotIdx: number;
}

export class Level extends BaseGameObject {
  playerSpots: LevelSpot[] = [];
  bulletSpots: LevelSpot[] = [];
  player: Player;
  enemySpawner: EnemySpawner;
  enemyClasses: typeof Enemy[] = [];
  enemyStateMap: EnemyStateMap = {};
  // maps lane indices to enemies in lane
  enemyLaneMap: EnemyLaneMap = {};
  // maps lane indices to bullets in lane
  bulletLaneMap: BulletLaneMap = {};
  playerSpotIdx: number = 0;
  targetSpotIdx: number = 0;
  updatingSpot: boolean = false;
  loops: boolean = true;
  throttledUpdateSpot: Function;
  // Level-specific points
  farPoints: Point[] = [];
  midpoints: Point[] = [];
  farMidpoints: Point[] = [];

  constructor(props: LevelPropsInterface) {
    super(props);
    const { loops } = props;
    if (loops !== undefined) this.loops = loops;
    this.throttledUpdateSpot = throttle(this.updatePlayerSpot.bind(this), 50);
  }

  startSpawning() {
    this.enemySpawner = new EnemySpawner({
      ...this.game.getDefaultProps(),
      level: this,
      enemyClasses: this.enemyClasses,
    });
    this.enemySpawner.spawnEnemies();
  }

  setPlayer(player: Player) {
    this.player = player;
    player.updateTransformWithProps(this.playerSpots[this.playerSpotIdx]);
    this.player.setLevel(this);
    this.addChildren(player);
  }

  addEnemy(enemy: Enemy) {
    if (this.enemyStateMap[enemy.id]) return;

    const spotIdx = Math.floor(this.farMidpoints.length * Math.random());

    // store references to enemy
    this.enemyStateMap[enemy.id] = {
      enemy,
      spotIdx,
    };
    if (this.enemyLaneMap[spotIdx]) {
      this.enemyLaneMap[spotIdx].enqueue(enemy);
    } else {
      this.enemyLaneMap[spotIdx] = new Queue<Enemy>(enemy);
    }

    this.addChildren(enemy);

    const fromPoint = this.farMidpoints[spotIdx];
    const toPoint = this.midpoints[spotIdx];
    enemy.setTransformWithProps({
      ...fromPoint,
      w: ENEMY_TO_LEVEL_SIZE,
      h: ENEMY_TO_LEVEL_SIZE,
      angle: Math.PI / 2 - calcAngle(toPoint.x, toPoint.y),
    });
    enemy.updatePath(fromPoint, this.midpoints[spotIdx]);
    enemy.setLevel(this);
  }

  // clear enemy references
  removeEnemy(enemy: Enemy) {
    const { spotIdx } = this.enemyStateMap[enemy.id];
    delete this.enemyLaneMap[spotIdx][enemy.id];
    delete this.enemyStateMap[enemy.id];
    enemy.destroy();
  }

  addBullet(bullet: Bullet, laneIdx: number) {
    if (this.bulletLaneMap[laneIdx]) {
      this.bulletLaneMap[laneIdx].enqueue(bullet);
    } else {
      this.bulletLaneMap[laneIdx] = new Queue<Bullet>(bullet);
    }
  }

  // TODO:
  moveEnemy(enemy: Enemy, spotDiff: number) {}

  // to be overwritten by Level classes
  getLevelPoints(): Point[] {
    return [];
  }

  // sets points
  initPoints() {
    this.points = this.getLevelPoints();
    this.farPoints = this.points.map(({ x, y }) => {
      const { x: bx, y: by } = LEVEL_CENTER;
      return {
        x: bx + x * FAR_SCALE,
        y: by + y * FAR_SCALE,
      };
    });

    // also calculate midpoints
    this.midpoints = calcMidpoints(this.points, this.loops);
    this.farMidpoints = calcMidpoints(this.farPoints, this.loops);
  }

  // sets player spots based on points
  initPlayerSpots() {
    this.playerSpots = [];
  }

  // get bullet path at player's position
  getBulletPath(): { to: Point; from: Point } {
    return {
      to: this.midpoints[this.playerSpotIdx],
      from: this.farMidpoints[this.playerSpotIdx],
    };
  }

  getPlayerSpotIdx() {
    return this.playerSpotIdx;
  }

  _render() {
    this.renderLevelPoints(this.points);
    this.renderLevelPoints(this.farPoints);

    // render lines b/w near and far points
    for (let i = 0; i < this.points.length; i++) {
      const nearPt = this.points[i];
      const farPt = this.farPoints[i];
      const highlight =
        this.playerSpotIdx === i ||
        this.playerSpotIdx + 1 === i ||
        // handle loop
        (this.loops &&
          this.playerSpotIdx === this.points.length - 1 &&
          i === 0);
      const color = highlight ? COLORS.PLAYER : COLORS.LINE;

      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.localMoveTo(nearPt.x, nearPt.y);
      this.localLineTo(farPt.x, farPt.y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  renderLevelPoints(points: Point[]) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = COLORS.LINE;
    points.forEach(({ x, y }, i) => {
      i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
    });
    this.loops && this.ctx.closePath();
    this.ctx.stroke();
  }

  update() {
    this.throttledUpdateSpot();

    // check for collisions
    this.checkCollisions();

    // check for any bullets that need to be destroyed
    this.cleanBullets();
  }

  checkCollisions() {
    Object.keys(this.enemyLaneMap).forEach((laneIdx) => {
      const enemyLaneQueue = this.enemyLaneMap[laneIdx];
      const bulletLaneQueue = this.bulletLaneMap[laneIdx];

      if (!bulletLaneQueue) return;

      const firstEnemy = enemyLaneQueue.getFirst();
      const firstBullet = bulletLaneQueue.getFirst();
      const collides =
        firstEnemy &&
        firstBullet &&
        firstBullet.transform.z < 1 &&
        firstBullet.transform.z + BULLET_TOLERANCE >= firstEnemy.transform.z;

      if (collides) {
        bulletLaneQueue.dequeue();
        enemyLaneQueue.dequeue();
        this.removeEnemy(firstEnemy);
        firstBullet.destroy();
      }
    });
  }

  cleanBullets() {
    Object.keys(this.bulletLaneMap).forEach((laneIdx) => {
      const q = this.bulletLaneMap[laneIdx];

      while (q.getFirst() && q.getFirst().transform.z + BULLET_TOLERANCE > 1) {
        const bullet = q.dequeue();
        bullet.destroy();
      }
    });
  }

  // updates player position based on its spot index
  updatePlayerSpot() {
    if (
      !this.updatingSpot ||
      !this.player ||
      this.playerSpotIdx === this.targetSpotIdx ||
      // don't update if doesn't loop and have hit ends
      (!this.loops &&
        (this.targetSpotIdx < 0 ||
          this.targetSpotIdx >= this.playerSpots.length))
    )
      return;

    // look for fastest path if loops
    const forwardTarget =
      this.targetSpotIdx < this.playerSpotIdx
        ? this.playerSpots.length + this.targetSpotIdx
        : this.targetSpotIdx;
    const forwardPath = forwardTarget - this.playerSpotIdx;

    const backwardTarget =
      this.targetSpotIdx > this.playerSpotIdx
        ? this.targetSpotIdx - this.playerSpots.length
        : this.targetSpotIdx;
    const backwardPath = backwardTarget - this.playerSpotIdx;

    // increment by 1 space in best direction
    if (Math.abs(forwardPath) < Math.abs(backwardPath)) {
      this.playerSpotIdx += 1;
      if (this.playerSpotIdx >= this.playerSpots.length) this.playerSpotIdx = 0;
    } else {
      this.playerSpotIdx -= 1;
      if (this.playerSpotIdx < 0)
        this.playerSpotIdx = this.playerSpots.length - 1;
    }

    this.player.setTransformWithProps(this.playerSpots[this.playerSpotIdx]);
  }

  startUpdatingWithCursor(x: number, y: number) {
    this.updatingSpot = true;
  }

  stopUpdatingWithCursor() {
    this.updatingSpot = false;
  }
}
