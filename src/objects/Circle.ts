import { GameObjectInterface, Point } from "../types";
import { PLAYER_TO_LEVEL_DIST } from "../CONSTS";
import { Level, LevelPlayerSpot, LevelPropsInterface } from "./Level";

interface CirclePropsInterface extends LevelPropsInterface {
  segments?: number;
}

interface SegmentsMemo {
  [key: string]: Point[];
}

export class Circle extends Level implements GameObjectInterface {
  props: CirclePropsInterface;
  segments: number = 16;
  rotationSpeed: number = Math.PI / 2000; // per ms
  static pointsMemo: SegmentsMemo = {};

  constructor(props: CirclePropsInterface) {
    super(props);
    this.generatePlayerSpots();
  }

  getLevelPoints(): Point[] {
    if (!Circle.pointsMemo[this.segments]) {
      const segmentAngle: number = (2 * Math.PI) / this.segments;
      const pts = [];
      for (let i = 0; i < this.segments; i++) {
        const angle = segmentAngle * i;
        pts.push({
          x: 0.5 * Math.cos(angle),
          y: 0.5 * Math.sin(angle),
        });
      }
      Circle.pointsMemo[this.segments] = pts;
    }
    return Circle.pointsMemo[this.segments];
  }

  generatePlayerSpots() {
    const pts = this.getLevelPoints();
    const spots: LevelPlayerSpot[] = [];
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
        w: 0.1,
        h: 0.1,
        angle,
      });
    }
    this.setSpots(spots);
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
