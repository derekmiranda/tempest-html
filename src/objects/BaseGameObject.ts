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
    // x, y = obj's center position w.r.t. parent's unit space
    let childX = this.x + localX * this.w,
      childY = this.y + localY * this.h,
      // w, h = obj's dims w.r.t. parent's unit dims
      childW = this.w,
      childH = this.h;
    // parentX = this.parent ? this.parent.x : 0,
    // parentY = this.parent ? this.parent.y : 0

    let currObj: BaseGameObject = this;

    // ultimately resolving obj's dimensions w.r.t. highest parent i.e. canvas
    while (currObj.parent) {
      currObj = currObj.parent;
      childX = currObj.x + childX * currObj.w;
      childY = currObj.y + childY * currObj.h;
      childW *= currObj.w;
      childH *= currObj.h;
      // if (currObj.parent) {
      //   parentX = currObj.parent.x
      //   parentY = currObj.parent.y
      // }
    }

    // resolve canvas points
    const canvasX = this.ctx.canvas.width * (childX + 0.5);
    const canvasY = this.ctx.canvas.height * (childY + 0.5);

    return {
      x: canvasX,
      y: canvasY,
    };
  }

  localLineTo(localX: number, localY: number) {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    const rotated = rotate(localX, localY, this.angle);
    localX = rotated.x;
    localY = rotated.y;

    const resolvedDims: Point = this.resolveAncestryPosition(localX, localY);

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
