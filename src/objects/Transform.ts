import { matrix } from "../lib/matrix";
import { Matrix, TransformPropsInterface } from "../types";

export class Transform {
  private matrix: Matrix = matrix.identity();

  // transform props
  private x: number;
  private y: number;
  private z: number;
  private w: number;
  private h: number;
  private angle: number = 0;

  constructor({
    x = 0,
    y = 0,
    z = 0,
    w = 1,
    h = 1,
    angle = 0,
  }: TransformPropsInterface = {}) {
    this.setTransformWithProps({ x, y, z, w, h, angle });
  }

  setMatrix(m: Matrix, shouldUpdateProps: boolean = false) {
    this.matrix = m;
    if (shouldUpdateProps) {
      this.updateTransformProps();
    }
  }

  setTransformWithProps({
    x,
    y,
    w,
    z,
    h,
    angle,
  }: TransformPropsInterface): void {
    const newMat = matrix.identity();

    // apply translation
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    matrix.translate(newMat, this.x, this.y);

    // update z
    if (z !== undefined) this.z = z;

    // apply rotation
    if (angle !== undefined) this.angle = angle;
    if (this.angle >= Math.PI * 2) {
      this.angle = (this.angle / (Math.PI * 2)) % 1;
    }
    matrix.rotate(newMat, this.angle);

    // apply scale
    if (w !== undefined) this.w = w;
    if (h !== undefined) this.h = h;
    matrix.scale(newMat, this.w, this.h);

    this.matrix = newMat;
  }

  getTransformProps() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
      h: this.h,
      angle: this.angle,
    };
  }

  updateWithProps({ x, y, w, z, h, angle }: TransformPropsInterface): void {
    // apply translation
    if (x || y) {
      // cache xy
      if (x !== undefined) this.x += x;
      if (y !== undefined) this.y += y;

      matrix.translate(this.matrix, this.x, this.y);
    }

    // apply z
    if (z !== undefined) this.z += z;

    // apply rotation
    if (angle !== undefined) {
      // cache angle
      this.angle += angle;
      if (this.angle >= Math.PI * 2) {
        this.angle = (this.angle / (Math.PI * 2)) % 1;
      }
      matrix.rotate(this.matrix, angle);
    }

    // apply scale
    if (w || h) {
      if (w !== undefined) this.w *= w;
      if (h !== undefined) this.h *= h;

      matrix.scale(this.matrix, w, h);
    }
  }

  updateWithMatrix(m: Matrix, shouldUpdateProps: boolean = false) {
    matrix.multiply(this.matrix, m);

    if (shouldUpdateProps) {
      this.updateTransformProps();
    }
  }

  // calculates transform properties based on current matrix
  updateTransformProps() {
    this.x = this.matrix[6];
    this.y = this.matrix[7];
    this.angle = matrix.deriveAngle(this.matrix);

    const cosAngle = Math.cos(this.angle);
    this.w = this.matrix[0] / cosAngle;
    this.h = this.matrix[4] / cosAngle;
  }
}
