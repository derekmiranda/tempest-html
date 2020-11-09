import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { COLORS, PLAYER_TO_LEVEL_DIST } from "../CONSTS";
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

  getCirclePoints(segments): Point[] {
    if (!Circle.pointsMemo[segments]) {
      const segmentAngle: number = (2 * Math.PI) / segments;
      const pts = [];
      for (let i = 0; i < segments; i++) {
        const angle = segmentAngle * i;
        pts.push({
          x: 0.5 * Math.cos(angle),
          y: 0.5 * Math.sin(angle),
        });
      }
      Circle.pointsMemo[segments] = pts;
    }
    return Circle.pointsMemo[segments];
  }

  generatePlayerSpots() {
    const pts = this.getCirclePoints(this.segments);
    const spots: LevelPlayerSpot[] = [];
    for (let i = 0; i < pts.length; i++) {
      const j = i === pts.length - 1 ? 0 : i + 1;
      const p_i = pts[i];
      const p_j = pts[j];

      // average b/w two points
      const avg_x = (p_i.x + p_j.x) / 2;
      const avg_y = (p_i.y + p_j.y) / 2;
      const segAngle = (2 * Math.PI) / this.segments;
      const angle = -segAngle / 2 - i * segAngle;

      // TODO: get some distance
      spots.push({
        x: avg_x,
        y: avg_y,
        w: 0.1,
        h: 0.1,
        angle,
      });
    }
    this.setSpots(spots);
  }

  update(timeDelta: number) {
    // this.updateTransformWithProps({ angle: this.rotationSpeed * timeDelta });
  }

  render() {
    const pts = this.getCirclePoints(this.segments);
    this.ctx.strokeStyle = COLORS.LINE;
    this.ctx.beginPath();
    pts.forEach(({ x, y }, i) => {
      i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
    });
    this.localLineTo(pts[0].x, pts[0].y);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
