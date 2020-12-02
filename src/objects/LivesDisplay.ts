import { BaseGameObject } from "./BaseGameObject";
import { GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { renderPoints } from "../lib/utils";
import { player } from "../lib/shapes";

export class LivesDisplay extends BaseGameObject {
  lives: number = 3;
  color: string = COLORS.PLAYER;

  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = player();
  }

  render() {
    renderPoints(this);
  }
}
