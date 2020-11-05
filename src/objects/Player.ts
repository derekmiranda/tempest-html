import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";

export class Player extends BaseGameObject implements GameObjectInterface {
  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  render() {
    this.ctx.fillStyle = COLORS.PLAYER;
    this.localFillRect(0, 0, 1, 1);
  }
}
