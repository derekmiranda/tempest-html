import { matrix } from "../matrix";
import {
  GameObjectPropsInterface,
  Point,
  TransformPropsInterface,
} from "../types";
import { Transform } from "./Transform";

export class BaseGameObject {
  ctx: CanvasRenderingContext2D;
  parent: BaseGameObject;
  children: BaseGameObject[] = [];
  transform: Transform;
  // cached global transform matrix
  globalTransformMatrix: number[];

  constructor(props: GameObjectPropsInterface) {
    Object.assign(this, props);
    this.transform = new Transform(props);
    this.updateGlobalTransformation();
  }

  setParent(parent: BaseGameObject) {
    this.parent = parent;
    this.updateGlobalTransformation();
  }

  addChildren(children: BaseGameObject[] | BaseGameObject) {
    if (!Array.isArray(children)) children = [children];
    for (let child of children) {
      child.setParent(this);
      this.children.push(child);
    }
  }

  updateTransformWithProps(props: TransformPropsInterface) {
    this.transform.updateWithProps(props);
    this.updateGlobalTransformation();
  }

  // updates transformation matrix relative to whole canvas
  // and children's as well
  updateGlobalTransformation() {
    // update this object's global transformation matrix
    this.globalTransformMatrix = this.transform.matrix.slice();

    if (this.parent) {
      const parentGlobalMat = this.parent.globalTransformMatrix;
      matrix.multiply(this.globalTransformMatrix, parentGlobalMat);

      // TODO: fix parent-relative translation + rotation
      // when parent rotates, child should stay anchored w/ parent
      // however, child moves along one track when animating parent rotation
      const x = this.transform.x;
      const y = this.transform.y;
      const newTranslateX = parentGlobalMat[0] * x + parentGlobalMat[6];
      const newTranslateY = parentGlobalMat[4] * y + parentGlobalMat[7];
      this.globalTransformMatrix[6] = newTranslateX;
      this.globalTransformMatrix[7] = newTranslateY;
    }
    // and children's matrices
    for (let child of this.children) child.updateGlobalTransformation();
  }

  normalizePoints(relX: number, relY: number): Point {
    return {
      x: this.ctx.canvas.width * (relX + 0.5),
      y: this.ctx.canvas.height * (relY + 0.5),
    };
  }

  localLineTo(localX: number, localY: number) {
    const resolved: Point = matrix.transformPoint(
      this.globalTransformMatrix,
      localX,
      localY
    );
    const normalized: Point = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.lineTo(normalized.x, normalized.y);
  }

  localMoveTo(localX: number, localY: number) {
    const resolved: Point = matrix.transformPoint(
      this.globalTransformMatrix,
      localX,
      localY
    );
    const normalized: Point = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.moveTo(normalized.x, normalized.y);
  }
}
