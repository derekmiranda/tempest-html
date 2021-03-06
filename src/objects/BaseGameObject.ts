import { Game } from "../Game";
import { matrix } from "../lib/matrix";
import {
  GameObjectPropsInterface,
  Point,
  TransformPropsInterface,
} from "../types";
import { Transform } from "./Transform";

export class BaseGameObject {
  id: number;
  ctx: CanvasRenderingContext2D;
  game: Game;
  parent: BaseGameObject;
  children: BaseGameObject[] = [];
  transform: Transform;
  globalTransform: Transform;
  layer: number;
  rendered: boolean = false;
  visible: boolean = true;

  // rendering props
  points: Point[] = [];
  useStrokes: boolean = true;
  color: string = "#000";

  constructor(props: GameObjectPropsInterface) {
    Object.assign(this, props);
    this.transform = new Transform(props);
    this.updateGlobalTransform();
  }

  // sets this.points
  initPoints() {
    this.points = [];
  }

  // sets event listeners
  setListeners() {}

  // remove event listeners
  removeListeners() {}

  // render and update
  // write render and update function on classes extended BaseGameObject
  // _render and _update are used internally by game loop
  _render() {
    this.render();
  }
  render() {}

  _update(timeDelta: number, time: number) {
    if (timeDelta < 0) return;
    this.update(timeDelta, time);
  }
  update(timeDelta: number, time: number) {}

  setParent(parent: BaseGameObject) {
    this.parent = parent;
    this.updateGlobalTransform();
  }

  addChildren(children: BaseGameObject[] | BaseGameObject) {
    if (!Array.isArray(children)) children = [children];
    for (let child of children) {
      child.setParent(this);
      this.children.push(child);
      if (this.rendered) {
        this.game.addObject(child);
      }
    }
  }

  removeChild(child: BaseGameObject) {
    const childIdx = this.children.indexOf(child);
    if (childIdx > 0) this.children.splice(childIdx, 1);
  }

  // base destroy method
  _destroy() {
    this.rendered = false;
    this.game.removeObject(this);
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
  destroy() {
    this._destroy();
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
      // TODO: update translation w/ z
      // update global transform w/ parent's global transform
      const parentGlobalMat = this.parent.globalTransform.getMatrix();
      const parentGlobalProps = this.parent.globalTransform.getTransformProps();
      this.globalTransform.updateWithProps(parentGlobalProps);

      const { x, y, z } = this.transform.getTransformProps();
      const newTranslateX =
        parentGlobalMat[0] * x + parentGlobalMat[3] * y + parentGlobalProps.x;
      const newTranslateY =
        parentGlobalMat[1] * x + parentGlobalMat[4] * y + parentGlobalProps.y;
      this.globalTransform.setTransformWithProps({
        x: newTranslateX,
        y: newTranslateY,
        z,
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
      this.globalTransform.getMatrix(),
      localX,
      localY
    );
    const normalized: Point = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.lineTo(normalized.x, normalized.y);
  }

  localMoveTo(localX: number, localY: number) {
    const resolved: Point = matrix.transformPoint(
      this.globalTransform.getMatrix(),
      localX,
      localY
    );
    const normalized: Point = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.moveTo(normalized.x, normalized.y);
  }

  setLayer(layer) {
    this.layer = layer;
  }

  setRenderedState(state: boolean) {
    this.rendered = state;
  }
}
