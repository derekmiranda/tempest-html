import { matrix } from "../matrix";
import { Matrix, TransformPropsInterface } from "../types";

export class Transform {
  matrix: Matrix = matrix.identity();

  // transform props
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number = 0;

  constructor({
    x = 0,
    y = 0,
    w = 1,
    h = 1,
    angle = 0,
  }: TransformPropsInterface = {}) {
    this.setTransformWithProps({ x, y, w, h, angle });
  }

  setMatrix(m: Matrix) {
    this.matrix = m;
  }

  setTransformWithProps({ x, y, w, h, angle }: TransformPropsInterface): void {
    const newMat = matrix.identity();

    // apply translation
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    matrix.translate(newMat, this.x, this.y);

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
      w: this.w,
      h: this.h,
      angle: this.angle,
    };
  }

  updateWithProps({ x, y, w, h, angle }: TransformPropsInterface): void {
    // apply translation
    if (x || y) {
      // cache xy
      if (x !== undefined) this.x += x;
      if (y !== undefined) this.y += y;

      matrix.translate(this.matrix, this.x, this.y);
    }

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
