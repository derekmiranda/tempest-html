import { DimsInterface, GameObjectPropsInterface, Point } from "../types";
import { rotate } from "../utils";

export class BaseGameObject {
  ctx: CanvasRenderingContext2D;
  x: number = 0.5;
  y: number = 0.5;
  worldX: number;
  worldY: number;
  xAnchor: number = 0.5;
  yAnchor: number = 0.5;
  w: number = 1;
  h: number = 1;
  worldW: number;
  worldH: number;
  angle: number = 0;
  parent: BaseGameObject;

  constructor(props: GameObjectPropsInterface) {
    Object.assign(this, props);
  }

  setParent(parent: BaseGameObject) {
    this.parent = parent;
  }

  /* methods to scale local to world geometry */

  // TODO: only calc when needed, pull from cache
  // get final canvas-relative x after positioning object in relation to parent chain
  resolveAncestryPosition(localX: number, localY: number): Point {
    let newX = localX + 0.5 / this.w,
      newY = localY + 0.5 / this.h,
      newW = this.w,
      newH = this.h;

    const canvasData = {
      x: 0,
      y: 0,
      w: this.ctx.canvas.width,
      h: this.ctx.canvas.height,
    };

    let currParent: any = this.parent || canvasData;
    let hasResolvedCanvas: boolean = currParent === canvasData;

    while (currParent) {
      newW *= currParent.w;
      newH *= currParent.h;
      newX = currParent.x + newW * newX;
      newY = currParent.y + newH * newY;

      currParent = currParent.parent;

      // check canvas as last parent
      if (!hasResolvedCanvas && !currParent) {
        currParent = canvasData;
        hasResolvedCanvas = true;
      }
    }

    return {
      x: newX,
      y: newY,
    };
  }

  localLineTo(localX: number, localY: number) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const rotated = rotate(localX, localY, this.angle);
    localX = rotated.x;
    localY = rotated.y;

    const resolvedDims: Point = this.resolveAncestryPosition(localX, localY);
    console.log("localX", localX);
    console.log("localY", localY);
    console.log("resolvedDims", resolvedDims);

    // let relX = this.x + this.w * localX;
    // let relY = this.y + this.h * localY;

    // const worldX = canvasWidth * relX;
    // const worldY = canvasHeight * relY;
    this.ctx.lineTo(resolvedDims.x, resolvedDims.y);
  }

  localMoveTo(localX: number, localY: number) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const rotated = rotate(localX, localY, this.angle);
    localX = rotated.x;
    localY = rotated.y;

    const resolvedDims: Point = this.resolveAncestryPosition(localX, localY);
    console.log("localX", localX);
    console.log("localY", localY);
    console.log("resolvedDims", resolvedDims);

    // let relX = this.x + this.w * localX;
    // let relY = this.y + this.h * localY;

    // const worldX = canvasWidth * relX;
    // const worldY = canvasHeight * relY;
    this.ctx.lineTo(resolvedDims.x, resolvedDims.y);
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
