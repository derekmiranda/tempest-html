import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface, Point } from "../types";
import { COLORS } from "../CONSTS";
import { circle } from "../lib/shapes";

export class Bullet extends BaseGameObject implements GameObjectInterface {
  color: string = COLORS.BULLET;
  points: Point[];

  constructor(props: GameObjectPropsInterface) {
    super(props);
    this.initPoints();
  }

  initPoints() {
    this.points = circle(4);
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.points.forEach(({ x, y }, i) => {
      i === 0 ? this.localMoveTo(x, y) : this.localLineTo(x, y);
    });
    this.ctx.closePath();
    this.ctx.fill();
  }
}
