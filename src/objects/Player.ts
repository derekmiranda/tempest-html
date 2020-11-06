import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";

export class Player extends BaseGameObject implements GameObjectInterface {
  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  render() {
    this.ctx.fillStyle = COLORS.PLAYER;
    this.ctx.beginPath();
    this.localMoveTo(-0.5, 0.5);
    this.localLineTo(0.5, 0.5);
    this.localLineTo(0.5, -0.5);
    this.localLineTo(-0.5, -0.5);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
