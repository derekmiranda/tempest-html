import {
  BaseGameObject,
  GameObjectInterface,
  GameObjectPropsInterface,
} from "../types";
import { COLORS } from "../CONSTS";

interface CirclePropsInterface extends GameObjectPropsInterface {
  segments?: number;
}

export class Circle extends BaseGameObject implements GameObjectInterface {
  props: CirclePropsInterface;
  currAngle: number = 0;
  rotationSpeed: number = Math.PI / 2000; // per ms

  constructor(props: CirclePropsInterface) {
    super(props);
    if (!this.props.segments) this.props.segments = 16;
  }

  update(timeDelta: number) {
    this.currAngle += this.rotationSpeed * timeDelta;
  }

  render() {
    const segmentAngle: number = (2 * Math.PI) / this.props.segments;

    let firstX: number, firstY: number;
    this.props.ctx.strokeStyle = COLORS.LINE;
    this.props.ctx.beginPath();
    for (let i = 0; i < this.props.segments; i++) {
      const angle = this.currAngle + segmentAngle * i;

      const x = 0.5 + 0.5 * Math.cos(angle),
        y = 0.5 + 0.5 * Math.sin(angle);

      if (i === 0) {
        firstX = x;
        firstY = y;
        this.localMoveTo(x, y);
      } else {
        this.localLineTo(x, y);
      }
    }
    this.localLineTo(firstX, firstY);
    this.props.ctx.closePath();
    this.props.ctx.stroke();
  }

  // methods to scale local to world geometry
  localLineTo(localX: number, localY: number) {
    const canvasWidth = this.props.ctx.canvas.width;
    const canvasHeight = this.props.ctx.canvas.height;

    const worldX = this.props.x + this.props.w * localX;
    const worldY = this.props.y + this.props.h * localY;
    this.props.ctx.lineTo(worldX * canvasWidth, worldY * canvasHeight);
  }

  localMoveTo(localX: number, localY: number) {
    const canvasWidth = this.props.ctx.canvas.width;
    const canvasHeight = this.props.ctx.canvas.height;

    const worldX = this.props.x + this.props.w * localX;
    const worldY = this.props.y + this.props.h * localY;
    this.props.ctx.moveTo(worldX * canvasWidth, worldY * canvasHeight);
  }

  setListeners() {}
}
