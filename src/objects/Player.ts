import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";

interface PlayerPropsInterface extends GameObjectPropsInterface {
  color?: string;
}

export class Player extends BaseGameObject implements GameObjectInterface {
  color: string;
  rotationSpeed: number = Math.PI / 2000; // per ms

  // update(timeDelta: number) {
  //   this.updateTransformWithProps({ angle: this.rotationSpeed * timeDelta });
  // }

  constructor(props: PlayerPropsInterface) {
    super(props);
    if (!this.color) {
      this.color = COLORS.PLAYER;
    }
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.localMoveTo(-0.5, 0.5);
    this.localLineTo(0.5, 0.5);
    this.localLineTo(0.5, -0.5);
    this.localLineTo(-0.5, -0.5);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
