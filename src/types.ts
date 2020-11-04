export type Point = {
  x: number;
  y: number;
};

export interface GameObjectInterface extends BaseGameObject {
  render(): void;
  update?(timeDelta: number): void;
  setListeners?(): void;

  // methods to normalize local drawing to canvas dimensions
  localLineTo?(): void;
  localMoveTo?(): void;
}

export class BaseGameObject {
  props: GameObjectPropsInterface;
  constructor(props: GameObjectPropsInterface) {
    this.props = props;
  }
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
