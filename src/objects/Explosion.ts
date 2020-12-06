import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { explosion } from "../lib/shapes";
import { renderPoints } from "../lib/utils";

export class Explosion extends BaseGameObject implements GameObjectInterface {
  color = "yellow";

  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = explosion();
  }

  render() {
    renderPoints(this);
  }
}
