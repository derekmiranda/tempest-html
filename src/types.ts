export type Point = {
  x: number;
  y: number;
};

export interface GameObjectInterface extends BaseGameObject {
  render(): void;
  update?(timeDelta: number): void;
  setListeners?(): void;
}

export class BaseGameObject {
  props: GameObjectPropsInterface;
  constructor(props: GameObjectPropsInterface) {
    this.props = props;
  }
}

export interface GameObjectPropsInterface {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
}
