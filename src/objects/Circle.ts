import { GameObjectInterface, Point } from "../types";
import { PLAYER_TO_LEVEL_DIST, PLAYER_TO_LEVEL_SIZE } from "../CONSTS";
import { Level, LevelSpot, LevelPropsInterface } from "./Level";
import { circle } from "../lib/shapes";

interface CirclePropsInterface extends LevelPropsInterface {
  segments?: number;
}

interface SegmentsMemo {
  [key: string]: Point[];
}

export class Circle extends Level implements GameObjectInterface {
  props: CirclePropsInterface;
  rotationSpeed: number = Math.PI / 2000; // per ms
  segments: number = 16;
  static pointsMemo: SegmentsMemo = {};

  constructor(props: CirclePropsInterface) {
    super(props);
  }

  getLevelPoints(): Point[] {
    return circle(this.segments);
  }

  initPlayerSpots() {
    const pts = this.points;
    const spots: LevelSpot[] = [];
    for (let i = 0; i < pts.length; i++) {
      const j = i === pts.length - 1 ? 0 : i + 1;
      const p_i = pts[i];
      const p_j = pts[j];

      // average b/w two points
      const avg_x = (p_i.x + p_j.x) / 2;
      const avg_y = (p_i.y + p_j.y) / 2;
      const segAngle = (2 * Math.PI) / this.segments;
      const normalAngle = segAngle * (0.5 + i);
      const angle = Math.PI / 2 - normalAngle;

      const x = avg_x + PLAYER_TO_LEVEL_DIST * Math.cos(normalAngle);
      const y = avg_y + PLAYER_TO_LEVEL_DIST * Math.sin(normalAngle);

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

    let angle = Math.atan(normY / normX);
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
