import { BaseGameObject } from "./BaseGameObject";
import { GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { renderPoints, rotate } from "../lib/utils";
import { player } from "../lib/shapes";

interface LivesDisplayPropsInterface extends GameObjectPropsInterface {
  lives: number;
}

export class LivesDisplay extends BaseGameObject {
  lives: number;
  color: string = COLORS.PLAYER;

  constructor(props: LivesDisplayPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = player().map((p) => rotate(p.x, p.y, Math.PI));
  }

  render() {
    for (let i = 0; i < this.lives; i++) {
      renderPoints(this, {
        xOffset: i * 1.2,
      });
    }
  }
}
