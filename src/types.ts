import { rotate } from "./utils";

export type Point = {
  x: number;
  y: number;
};

export interface GameObjectInterface extends BaseGameObject {
  render(): void;
  update?(timeDelta: number): void;
  setListeners?(): void;

  // methods to normalize local drawing to canvas dimensions
  localLineTo(localX: number, localY: number): void;
  localMoveTo(localX: number, localY: number): void;
  localFillRect(
    localX: number,
    localY: number,
    localW: number,
    localH: number
  ): void;
}

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

    let relX = this.x + this.w * localX;
    let relY = this.x + this.w * localY;

    const rotated = rotate(relX, relY, this.angle);
    relX = rotated.x;
    relY = rotated.y;

    const worldX = canvasWidth * relX;
    const worldY = canvasHeight * relY;
    this.ctx.lineTo(worldX, worldY);
  }

  localMoveTo(localX: number, localY: number) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    let relX = this.x + this.w * localX;
    let relY = this.x + this.w * localY;

    const rotated = rotate(relX, relY, this.angle);
    relX = rotated.x;
    relY = rotated.y;

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

export interface GameObjectPropsInterface extends DimsInterface {
  ctx: CanvasRenderingContext2D;
}

export interface DimsInterface {
  x: number;
  y: number;
  w: number;
  h: number;
}
