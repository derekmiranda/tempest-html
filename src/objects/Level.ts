import {
  GameObjectPropsInterface,
  TransformPropsInterface,
  Point,
} from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Player } from "./Player";
import {
  calcAngle,
  calcMidpoints,
  findValueBetweenValues,
  getPercentBetweenValues,
  shouldMoveForwardInLoop,
  sleep,
  throttle,
} from "../lib/utils";
import {
  LEVEL_CENTER,
  FAR_SCALE,
  COLORS,
  BULLET_TOLERANCE,
  NEAR_BULLET_TOLERANCE,
  COLLISION_TOLERANCE,
  GAME_OVER_ANIM_SPEED,
  RED_ENEMY_SPEED,
  LEVEL_WON_ANIM_SPEED,
} from "../CONSTS";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";
import { EnemySpawner } from "./EnemySpawner";
import { AsyncAction } from "../lib/AsyncAction";
import { SceneType } from "../Game";

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
  // w-value for zoom in anim after winning
  static zoomInW: number = 15;

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
  levelWon: boolean = false;
  levelWonAnim: AsyncAction = new AsyncAction();
  levelWonStartTransform: TransformPropsInterface;
  gameOverAnim: AsyncAction = new AsyncAction();

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

  addEnemy(enemy: Enemy, spotIdx?: number) {
    if (this.enemyStateMap[enemy.id]) return;

    enemy.setRenderedState(true);

    if (spotIdx === undefined) {
      spotIdx = Math.floor(this.farMidpoints.length * Math.random());
    }

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
    enemy.updateSpotIdx(spotIdx);
    this.addChildren(enemy);

    enemy.setLevel(this);
  }

  updateEnemyPath(enemy: Enemy, spotIdx: number) {
    const fromPoint = this.midpoints[spotIdx];
    const toPoint = this.farMidpoints[spotIdx];
    enemy.setTransformWithProps({
      ...fromPoint,
      angle: Math.PI / 2 - calcAngle(fromPoint.x, fromPoint.y),
    });
    enemy.updatePath(fromPoint, toPoint);
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
    enemy.updateSpotIdx(newSpotIdx);

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
    if (this.checkWin() && !this.levelWon) {
      this.processWin();
    }

    // render animations
    if (this.levelWonAnim.active) {
      this.playLevelWonAnim(timeUpdate);
    } else if (this.gameOverAnim.active) {
      this.playGameOverAnim(timeUpdate);
    }
  }

  checkWin(): boolean {
    return (
      this.player.isAlive &&
      Object.values(this.enemyLaneMap).every(
        (lane) => !lane || Object.keys(lane).length === 0
      )
    );
  }

  async processWin() {
    this.levelWon = true;
    if (!this.levelWonAnim.active) {
      if (this.game.hasWonGame()) {
        await sleep(1500);
        this.game.updateState({
          sceneType: SceneType.WIN,
        });
        this.game.startScene();
      } else {
        await sleep(1000);
        await this.onLevelWin();
        await sleep(500);
        this.game.updateState({
          sceneType: SceneType.LEVEL,
          levelState: {
            idx: this.game.state.levelState.idx + 1,
          },
        });
        this.game.startScene();
      }
    }
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

          const zDist = Math.abs(bullet.transform.z - enemy.transform.z);
          if (
            zDist <
            (enemy.onNearPlane ? NEAR_BULLET_TOLERANCE : BULLET_TOLERANCE)
          ) {
            delete bulletMap[bulletId];
            delete enemyMap[enemyId];
            this.removeEnemy(enemy);
            this.game.updateState({
              score: this.game.state.score + enemy.score,
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
    // increment by 1 space in best direction
    if (
      shouldMoveForwardInLoop(
        this.playerSpotIdx,
        this.targetSpotIdx,
        this.playerSpots.length
      )
    ) {
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
    return this.gameOverAnim.start();
  }

  playGameOverAnim(timeUpdate: number) {
    if (this.transform.w > 0.01) {
      this.setTransformWithProps({
        w: this.transform.w - GAME_OVER_ANIM_SPEED * timeUpdate,
        h: this.transform.h - GAME_OVER_ANIM_SPEED * timeUpdate,
      });
    } else {
      this.gameOverAnim.complete();
    }
  }

  onLevelWin(): Promise<void> {
    this.levelWonStartTransform = this.transform.getTransformProps();
    return this.levelWonAnim.start();
  }

  playLevelWonAnim(timeUpdate: number) {
    if (this.globalTransform.w < Level.zoomInW) {
      const { w } = this.levelWonStartTransform;
      const k = getPercentBetweenValues(w, Level.zoomInW, this.transform.w);

      const newY = -findValueBetweenValues(
        0,
        LEVEL_CENTER.y * this.transform.w,
        k
      );
      this.setTransformWithProps({
        y: newY,
        w: this.transform.w + LEVEL_WON_ANIM_SPEED * timeUpdate,
        h: this.transform.h + LEVEL_WON_ANIM_SPEED * timeUpdate,
      });
    } else {
      this.levelWonAnim.complete();
    }
  }

  startUpdatingWithCursor(x: number, y: number) {
    this.updatingSpot = true;
  }

  stopUpdatingWithCursor() {
    this.updatingSpot = false;
  }
}
