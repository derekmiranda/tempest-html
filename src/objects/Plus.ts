import { GameObjectInterface, Point } from "../types";
import { PLAYER_TO_LEVEL_SIZE, RED_ENEMY_SPEED } from "../CONSTS";
import { Level, LevelSpot, LevelPropsInterface } from "./Level";
import { Enemy } from "./Enemy";
import { RedEnemy } from "./RedEnemy";
import { plus } from "../lib/shapes";
import { calcAngle } from "../lib/utils";

interface SegmentsMemo {
  [key: string]: Point[];
}

export class Plus extends Level implements GameObjectInterface {
  props: LevelPropsInterface;
  enemyClasses: typeof Enemy[] = new Array(30).fill(RedEnemy);
  enemySpeed: number = RED_ENEMY_SPEED * 1.5;
  static pointsMemo: SegmentsMemo = {};

  constructor(props: LevelPropsInterface) {
    super(props);
  }

  getLevelPoints(): Point[] {
    return plus();
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

      const angle = calcAngle(p_j.x - p_i.x, p_j.y - p_i.y) + Math.PI;

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

    const angle = calcAngle(normX, normY);
    const segmentAngle = (2 * Math.PI) / this.points.length;
    let idx = Math.floor(angle / segmentAngle);
    if (idx < 0) idx += this.points.length;
    this.targetSpotIdx = idx;
  }
}
