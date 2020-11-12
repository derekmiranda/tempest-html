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
  globalTransform: Transform;

  constructor(props: GameObjectPropsInterface) {
    Object.assign(this, props);
    this.transform = new Transform(props);
    this.updateGlobalTransform();
  }

  setParent(parent: BaseGameObject) {
    this.parent = parent;
    this.updateGlobalTransform();
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
    this.updateGlobalTransform();
  }

  setTransformWithProps(props: TransformPropsInterface) {
    this.transform.setTransformWithProps(props);
    this.updateGlobalTransform();
  }

  // updates transformation matrix relative to whole canvas
  // and children's as well
  updateGlobalTransform() {
    this.globalTransform = new Transform();
    this.globalTransform.updateWithProps(this.transform.getTransformProps());

    if (this.parent) {
      // update global transform w/ parent's global transform
      const parentGlobalMat = this.parent.globalTransform.matrix;
      const parentGlobalProps = this.parent.globalTransform.getTransformProps();
      this.globalTransform.updateWithProps(parentGlobalProps);

      const x = this.transform.x;
      const y = this.transform.y;
      const newTranslateX =
        parentGlobalMat[0] * x + parentGlobalMat[3] * y + parentGlobalProps.x;
      const newTranslateY =
        parentGlobalMat[1] * x + parentGlobalMat[4] * y + parentGlobalProps.y;
      this.globalTransform.setTransformWithProps({
        x: newTranslateX,
        y: newTranslateY,
      });
    }

    // and children's matrices
    for (let child of this.children) child.updateGlobalTransform();
  }

  normalizePoints(relX: number, relY: number): Point {
    return {
      x: this.ctx.canvas.width * (relX + 0.5),
      y: this.ctx.canvas.height * (relY + 0.5),
    };
  }

  localLineTo(localX: number, localY: number) {
    const resolved: Point = matrix.transformPoint(
      this.globalTransform.matrix,
      localX,
      localY
    );
    const normalized: Point = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.lineTo(normalized.x, normalized.y);
  }

  localMoveTo(localX: number, localY: number) {
    const resolved: Point = matrix.transformPoint(
      this.globalTransform.matrix,
      localX,
      localY
    );
    const normalized: Point = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.moveTo(normalized.x, normalized.y);
  }
}
