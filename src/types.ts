import { BaseGameObject } from "./objects/BaseGameObject";

export type Point = {
  x: number;
  y: number;
};

export interface GameObjectInterface extends BaseGameObject {
  render(): void;
  update?(timeDelta: number): void;
  setListeners?(): void;

  // methods to normalize local drawing to canvas dimensions
  localLineTo(localX: number, localY: number): void;
  localMoveTo(localX: number, localY: number): void;
  localFillRect(
    localX: number,
    localY: number,
    localW: number,
    localH: number
  ): void;
}

export interface GameObjectPropsInterface extends DimsInterface {
  ctx: CanvasRenderingContext2D;
}

export interface DimsInterface {
  x: number;
  y: number;
  w: number;
  h: number;
}
