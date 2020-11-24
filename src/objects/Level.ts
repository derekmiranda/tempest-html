import {
  GameObjectPropsInterface,
  TransformPropsInterface,
  Point,
} from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Player } from "./Player";
import { calcMidpoints, throttle } from "../lib/utils";
import { LEVEL_CENTER, FAR_SCALE, COLORS } from "../CONSTS";

export interface LevelSpot extends TransformPropsInterface {}

export interface LevelPropsInterface extends GameObjectPropsInterface {
  loops?: boolean;
}

export class Level extends BaseGameObject {
  playerSpots: LevelSpot[] = [];
  bulletSpots: LevelSpot[] = [];
  player: Player;
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

  setPlayer(player: Player) {
    this.player = player;
    player.updateTransformWithProps(this.playerSpots[this.playerSpotIdx]);
    this.player.setLevel(this);
    this.addChildren(player);
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

  // overwrite BaseGameObject _update method
  _update(timeDelta: number, time: number) {
    this.throttledUpdateSpot();
    this.update(timeDelta, time);
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
