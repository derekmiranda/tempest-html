import { GameObjectInterface, Point } from "../types";
import { PLAYER_TO_LEVEL_DIST, PLAYER_TO_LEVEL_SIZE } from "../CONSTS";
import { Level, LevelSpot, LevelPropsInterface } from "./Level";
import { Enemy } from "./Enemy";
import { RedEnemy } from "./RedEnemy";
import { square } from "../lib/shapes";
import { calcAngle } from "../lib/utils";

interface SquarePropsInterface extends LevelPropsInterface {
  segments?: number;
}

interface SegmentsMemo {
  [key: string]: Point[];
}

export class Square extends Level implements GameObjectInterface {
  props: SquarePropsInterface;
  segments: number = 16;
  enemyClasses: typeof Enemy[] = new Array(20).fill(RedEnemy);
  static pointsMemo: SegmentsMemo = {};

  constructor(props: SquarePropsInterface) {
    super(props);
  }

  getLevelPoints(): Point[] {
    return square(this.segments);
  }

  initPlayerSpots() {
    const pts = this.points;
    const spots: LevelSpot[] = [];
    for (let i = 0; i < pts.length; i++) {
      const j = i === pts.length - 1 ? 0 : i + 1;
      const p_i = pts[i];
      const p_j = pts[j];

      // average b/w two points
      let x = (p_i.x + p_j.x) / 2;
      let y = (p_i.y + p_j.y) / 2;
      let angle;

      // choose angle based on side
      switch (Math.floor((4 * i) / this.segments)) {
        // from top-right to bottom-right
        case 0:
          x += PLAYER_TO_LEVEL_DIST;
          angle = Math.PI / 2;
          break;
        // from bottom-right to bottom-left
        case 1:
          y += PLAYER_TO_LEVEL_DIST;
          angle = 0;
          break;
        // from bottom-left to top-left
        case 2:
          x -= PLAYER_TO_LEVEL_DIST;
          angle = -Math.PI / 2;
          break;
        // from top-left to top-right
        case 3:
          y -= PLAYER_TO_LEVEL_DIST;
          angle = Math.PI;
      }

      spots.push({
        x,
        y,
        w: PLAYER_TO_LEVEL_SIZE,
        h: PLAYER_TO_LEVEL_SIZE,
        angle,
      });
    }
    this.playerSpots = spots;
  }

  startUpdatingWithCursor(x: number, y: number) {
    this.updatingSpot = true;
    const normX = x / this.ctx.canvas.width - 0.5;
    const normY = y / this.ctx.canvas.height - 0.5;

    // since spots start at top-right, shift angle by 45 deg CCW
    const angle = calcAngle(normX, normY) + Math.PI / 4;
    const segmentAngle = (2 * Math.PI) / this.segments;
    let idx = Math.floor(angle / segmentAngle);
    if (idx < 0) idx += this.segments;
    this.targetSpotIdx = idx;
  }
}
