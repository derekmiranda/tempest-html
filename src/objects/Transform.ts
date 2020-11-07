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

  // TODO: globally resolved transform props

  constructor({
    x = 0,
    y = 0,
    w = 1,
    h = 1,
    angle = 0,
  }: TransformPropsInterface) {
    this.updateWithProps({ x, y, w, h, angle });
  }

  updateWithProps({ x, y, w, h, angle }: TransformPropsInterface): void {
    // apply translation
    if (x || y) {
      // cache xy
      if (x !== undefined) this.x = x;
      if (y !== undefined) this.y = y;

      matrix.translate(this.matrix, this.x, this.y);
    }

    // apply rotation
    if (angle !== undefined) {
      // cache angle
      this.angle = angle;
      matrix.rotate(this.matrix, this.angle);
    }

    // apply scale
    if (w || h) {
      if (w !== undefined) this.w = w;
      if (h !== undefined) this.h = h;

      matrix.scale(this.matrix, this.w, this.h);
    }
  }

  updateWithMatrix(m: Matrix) {
    matrix.multiply(this.matrix, m);
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
