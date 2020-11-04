import { IRenderFunction } from "./types";

export class ShapeRenderer {
  ctx: CanvasRenderingContext2D;

  // dimensions of shape in terms of entire canvas
  x: number;
  y: number;
  width: number;
  height: number;

  // function to render shape
  renderFn: IRenderFunction;

  render() {
    this.renderFn(this.x, this.y, this.width, this.height);
  }
}
