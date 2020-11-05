import { GameObjectPropsInterface } from "../types";
import { rotate } from "../utils";

export class BaseGameObject {
  ctx: CanvasRenderingContext2D;
  x: number = 0.5;
  y: number = 0.5;
  xAnchor: number = 0.5;
  yAnchor: number = 0.5;
  w: number = 1;
  h: number = 1;
  angle: number = 0;

  constructor(props: GameObjectPropsInterface) {
    Object.assign(this, props);
  }

  // methods to scale local to world geometry
  localLineTo(localX: number, localY: number) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const rotated = rotate(localX, localY, this.angle);
    localX = rotated.x;
    localY = rotated.y;

    let relX = this.x + this.w * localX;
    let relY = this.x + this.w * localY;

    const worldX = canvasWidth * relX;
    const worldY = canvasHeight * relY;
    this.ctx.lineTo(worldX, worldY);
  }

  localMoveTo(localX: number, localY: number) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const rotated = rotate(localX, localY, this.angle);
    localX = rotated.x;
    localY = rotated.y;

    let relX = this.x + this.w * localX;
    let relY = this.x + this.w * localY;

    const worldX = canvasWidth * relX;
    const worldY = canvasHeight * relY;
    this.ctx.moveTo(worldX, worldY);
  }

  localFillRect(
    localX: number,
    localY: number,
    localW: number,
    localH: number
  ) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const worldX = canvasWidth * (this.x + this.w * localX);
    const worldY = canvasHeight * (this.y + this.h * localY);
    const worldW = canvasWidth * this.w * localW;
    const worldH = canvasWidth * this.h * localH;
    this.ctx.fillRect(worldX, worldY, worldW, worldH);
  }
}
