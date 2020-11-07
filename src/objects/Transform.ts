import { matrix } from "../matrix";
import { Matrix, TransformPropsInterface } from "../types";

export class Transform {
  matrix: Matrix = matrix.identity();

  constructor(props: TransformPropsInterface) {
    this.updateWithProps(props);
  }

  updateWithProps({
    x = 0,
    y = 0,
    w = 1,
    h = 1,
    angle = 0,
  }: TransformPropsInterface): void {
    // apply translation
    matrix.translate(this.matrix, x, y);
    // apply rotation
    matrix.rotate(this.matrix, angle);
    // apply scale
    matrix.scale(this.matrix, w, h);
  }

  updateWithMatrix(m: Matrix) {
    matrix.multiply(this.matrix, m);
  }
}
