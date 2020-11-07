import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { rotate } from "../utils";

interface CirclePropsInterface extends GameObjectPropsInterface {
  segments?: number;
}

export class Circle extends BaseGameObject implements GameObjectInterface {
  props: CirclePropsInterface;
  segments: number = 16;
  rotationSpeed: number = Math.PI / 2000; // per ms

  constructor(props: CirclePropsInterface) {
    super(props);
  }

  update(timeDelta: number) {
    // this.updateTransformWithProps({ angle: this.rotationSpeed * timeDelta });
  }

  render() {
    const segmentAngle: number = (2 * Math.PI) / this.segments;

    let firstX: number, firstY: number;
    this.ctx.strokeStyle = COLORS.LINE;
    this.ctx.beginPath();
    for (let i = 0; i < this.segments; i++) {
      const angle = segmentAngle * i;

      const x = 0.5 * Math.cos(angle),
        y = 0.5 * Math.sin(angle);

      if (i === 0) {
        firstX = x;
        firstY = y;
        this.localMoveTo(x, y);
      } else {
        this.localLineTo(x, y);
      }
    }
    this.localLineTo(firstX, firstY);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
