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
  BULLET_TOLERANCE,
  COLLISION_TOLERANCE,
  GAME_OVER_ANIM_SPEED,
  RED_ENEMY_SPEED,
} from "../CONSTS";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";
import { EnemySpawner } from "./EnemySpawner";

export interface LevelSpot extends TransformPropsInterface {}

export interface LevelPropsInterface extends GameObjectPropsInterface {
  loops?: boolean;
  enemySpeed?: number;
}

interface EnemyStateMap {
  [id: string]: EnemyState;
}

interface EnemyLaneMap {
  [laneIdx: string]: {
    [id: string]: Enemy;
  };
}

interface BulletLaneMap {
  [laneIdx: string]: {
    [id: string]: Bullet;
  };
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
  enemySpeed: number = RED_ENEMY_SPEED;
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
  // level won props
  levelWon: boolean = true;
  // game over props
  isGameOver: boolean = false;
  endGameOverAnimCb: Function;

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
      enemySpeed: this.enemySpeed,
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

    enemy.setRenderedState(true);

    const spotIdx = Math.floor(this.farMidpoints.length * Math.random());

    // store references to enemy
    this.enemyStateMap[enemy.id] = {
      enemy,
      spotIdx,
    };
    if (this.enemyLaneMap[spotIdx]) {
      this.enemyLaneMap[spotIdx][enemy.id] = enemy;
    } else {
      this.enemyLaneMap[spotIdx] = {
        [enemy.id]: enemy,
      };
    }

    this.updateEnemyPath(enemy, spotIdx);
    this.addChildren(enemy);

    enemy.setLevel(this);
  }

  updateEnemyPath(enemy: Enemy, spotIdx: number) {
    const fromPoint = this.farMidpoints[spotIdx];
    const toPoint = this.midpoints[spotIdx];
    enemy.setTransformWithProps({
      ...fromPoint,
      w: ENEMY_TO_LEVEL_SIZE,
      h: ENEMY_TO_LEVEL_SIZE,
      angle: Math.PI / 2 - calcAngle(toPoint.x, toPoint.y),
    });
    enemy.updatePath(fromPoint, this.midpoints[spotIdx]);
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
      this.bulletLaneMap[laneIdx][bullet.id] = bullet;
    } else {
      this.bulletLaneMap[laneIdx] = { [bullet.id]: bullet };
    }
  }

  moveEnemy(enemy: Enemy, spotDiff: number) {
    const { spotIdx } = this.enemyStateMap[enemy.id];

    let newSpotIdx: number = (spotIdx + spotDiff) % this.playerSpots.length;
    if (newSpotIdx < 0) newSpotIdx += this.playerSpots.length;

    // update enemy spot
    this.enemyStateMap[enemy.id].spotIdx = newSpotIdx;
    this.updateEnemyPath(enemy, newSpotIdx);

    // update lane queues
    delete this.enemyLaneMap[spotIdx][enemy.id];
    if (this.enemyLaneMap[newSpotIdx]) {
      this.enemyLaneMap[newSpotIdx][enemy.id] = enemy;
    } else {
      this.enemyLaneMap[newSpotIdx] = { [enemy.id]: enemy };
    }
  }

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

  update(timeUpdate: number) {
    this.throttledUpdateSpot();

    // check for collisions
    this.checkBulletEnemyCollisions();
    this.checkPlayerEnemyCollisions();

    // check for any bullets that need to be destroyed
    this.cleanBullets();

    // check if all enemies gone e.g. win this level
    if (this.checkWin()) {
      this.levelWon = true;
      return;
    }

    // render game over animation
    if (this.isGameOver) {
      this.playGameOverAnim(timeUpdate);
    }
  }

  checkWin(): boolean {
    return Object.values(this.enemyLaneMap).every(
      (lane) => !lane || Object.keys(lane).length === 0
    );
  }

  checkBulletEnemyCollisions() {
    Object.keys(this.enemyLaneMap).forEach((laneIdx) => {
      const enemyMap = this.enemyLaneMap[laneIdx];
      const bulletMap = this.bulletLaneMap[laneIdx];

      if (!bulletMap || !enemyMap) return;

      // check collisions between each bullet and enemy
      Object.keys(bulletMap).forEach((bulletId) => {
        const bullet = bulletMap[bulletId];
        Object.keys(enemyMap).forEach((enemyId) => {
          const enemy = enemyMap[enemyId];

          if (
            Math.abs(bullet.transform.z - enemy.transform.z) < BULLET_TOLERANCE
          ) {
            delete bulletMap[bulletId];
            delete enemyMap[enemyId];
            this.removeEnemy(enemy);
            this.game.updateState({
              score: this.game.state.score + 1000,
            });
            bullet.destroy();
          }
        });
      });

      // check collisions between player and enemy
      if (parseInt(laneIdx) === this.playerSpotIdx) {
        for (let enemy of Object.values(enemyMap)) {
          if (
            Math.abs(enemy.transform.z - this.player.transform.z) <
            COLLISION_TOLERANCE
          ) {
            this.player.onDeath();
            break;
          }
        }
      }
    });
  }

  checkPlayerEnemyCollisions() {
    if (!this.player.isAlive) return;
    Object.keys(this.enemyLaneMap).forEach((laneIdx) => {
      const enemyMap = this.enemyLaneMap[laneIdx];

      // check collisions between player and enemy
      if (parseInt(laneIdx) === this.playerSpotIdx) {
        for (let enemy of Object.values(enemyMap)) {
          if (
            Math.abs(enemy.transform.z - this.player.transform.z) <
            COLLISION_TOLERANCE
          ) {
            delete enemyMap[enemy.id];
            this.removeEnemy(enemy);
            this.player.onDeath();
            break;
          }
        }
      }
    });
  }

  cleanBullets() {
    Object.values(this.bulletLaneMap).forEach((bulletMap) => {
      Object.values(bulletMap)
        .filter((b) => b.transform.z > 1)
        .forEach((bullet) => {
          delete bulletMap[bullet.id];
          bullet.destroy();
        });
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

  onGameOver(): Promise<void> {
    return new Promise((resolve) => {
      this.isGameOver = true;
      this.endGameOverAnimCb = resolve;
    });
  }

  playGameOverAnim(timeUpdate: number) {
    if (this.transform.w > 0.01) {
      this.setTransformWithProps({
        w: this.transform.w - GAME_OVER_ANIM_SPEED * timeUpdate,
        h: this.transform.h - GAME_OVER_ANIM_SPEED * timeUpdate,
      });
    } else {
      this.isGameOver = false;
      this.endGameOverAnimCb();
    }
  }

  startUpdatingWithCursor(x: number, y: number) {
    this.updatingSpot = true;
  }

  stopUpdatingWithCursor() {
    this.updatingSpot = false;
  }
}
