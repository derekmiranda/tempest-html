import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";

interface PlayerPropsInterface extends GameObjectPropsInterface {
  color?: string;
}

export class Player extends BaseGameObject implements GameObjectInterface {
  color: string;

  constructor(props: PlayerPropsInterface) {
    super(props);
    if (!this.color) {
      this.color = COLORS.PLAYER;
    }
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.localMoveTo(0, -0.5);
    this.localLineTo(0.5, 0.5);
    this.localLineTo(-0.5, 0.5);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
