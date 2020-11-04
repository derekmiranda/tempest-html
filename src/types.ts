export type Point = {
  x: number;
  y: number;
};

export interface GameObject {
  ctx: CanvasRenderingContext2D;
  setListeners(): void;
  update(): void;
  render(): IRenderFunction;
}

export interface IRenderFunction {
  (x: number, y: number, width: number, height: number): Boolean;
}
