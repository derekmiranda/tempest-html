import { GameObjectInterface, Point } from "../types";
import { PLAYER_TO_LEVEL_DIST } from "../CONSTS";
import { Level, LevelPlayerSpot, LevelPropsInterface } from "./Level";
import { square } from "../lib/shapes";

interface SquarePropsInterface extends LevelPropsInterface {
  segments?: number;
}

interface SegmentsMemo {
  [key: string]: Point[];
}

export class Square extends Level implements GameObjectInterface {
  props: SquarePropsInterface;
  segments: number = 16;
  static pointsMemo: SegmentsMemo = {};

  constructor(props: SquarePropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = square(this.segments);
  }

  initSpots() {
    const pts = this.points;
    const spots: LevelPlayerSpot[] = [];
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
        w: 0.1,
        h: 0.1,
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
    let angle = Math.atan(normY / normX) + Math.PI / 4;
    // adjust angles in Quadrant III and IV
    if (normX < 0) {
      angle += Math.PI;
    }
    const segmentAngle = (2 * Math.PI) / this.segments;
    let idx = Math.floor(angle / segmentAngle);
    if (idx < 0) idx += this.segments;
    this.targetSpotIdx = idx;
  }
}
