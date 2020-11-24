import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { COLORS, BULLET_SPEED } from "../CONSTS";

export class Enemy extends BaseGameObject implements GameObjectInterface {
  color: string = COLORS.RED;
  points: Point[];

  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = [
      // left edge
      { x: -0.5, y: -0.25 },
      { x: -0.25, y: 0 },
      { x: -0.5, y: 0.25 },
      // right edge
      { x: 0.5, y: -0.25 },
      { x: 0.25, y: 0 },
      { x: 0.5, y: 0.25 },
    ];
  }

  render() {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.points.forEach(({ x, y }, i) => {
      i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
    });
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
