import { BaseGameObject } from "./objects/BaseGameObject";

export type Point = {
  x: number;
  y: number;
};

export interface GameObjectInterface extends BaseGameObject {
  render(): void;
  update(timeDelta: number, time: number): void;
  setListeners?(): void;

  // methods to normalize local drawing to canvas dimensions
  localLineTo(localX: number, localY: number): void;
  localMoveTo(localX: number, localY: number): void;

  // localFillRect(
  //   localX: number,
  //   localY: number,
  //   localW: number,
  //   localH: number
  // ): void;
}

export interface GameObjectPropsInterface extends TransformPropsInterface {
  ctx: CanvasRenderingContext2D;
  parent?: BaseGameObject;
}

export interface TransformPropsInterface {
  x?: number;
  y?: number;
  z?: number;
  w?: number;
  h?: number;
  angle?: number;
}

export type Matrix = number[];
