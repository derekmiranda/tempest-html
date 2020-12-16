import { TextObject } from "./TextObject";
import { BaseGameObject } from "./BaseGameObject";
import { GameObjectPropsInterface, TransformPropsInterface } from "../types";
import { findValueBetweenValues } from "../lib/utils";
import { COLORS } from "../CONSTS";

interface TitleAnimationPropsInterface extends GameObjectPropsInterface {
  text: string;
  farTransformProps: TransformPropsInterface;
  nearTransformProps: TransformPropsInterface;
}

export class TitleAnimation extends BaseGameObject {
  static colors = COLORS.TITLE_ANIM;
  static numTextObjs = COLORS.TITLE_ANIM.length * 3;
  textObjects: TextObject[] = [];
  text: string;
  farTransformProps: TransformPropsInterface;
  nearTransformProps: TransformPropsInterface;

  constructor(props: TitleAnimationPropsInterface) {
    super(props);
    this.createTextObjects();
  }

  createTextObjects() {
    for (let i = 0; i < TitleAnimation.numTextObjs; i++) {
      const k = i / TitleAnimation.numTextObjs;
      const tf = {
        x: 0,
        y: findValueBetweenValues(
          this.farTransformProps.y,
          this.nearTransformProps.y,
          k
        ),
        h: findValueBetweenValues(
          this.farTransformProps.h,
          this.nearTransformProps.h,
          k
        ),
      };
      const color =
        TitleAnimation.colors[
          Math.floor(
            i / (TitleAnimation.numTextObjs / TitleAnimation.colors.length)
          )
        ];
      this.textObjects.push(
        new TextObject({
          ...this.game.getDefaultProps(),
          ...tf,
          text: this.text,
          color,
        })
      );
    }

    console.log("this.textObjects", this.textObjects);
  }

  update(timeDelta: number) {}

  render() {
    this.textObjects.forEach((obj) => obj._render());
  }

  start() {}
}
