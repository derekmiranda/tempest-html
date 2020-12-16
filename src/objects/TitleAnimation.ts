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
  static timeCutoff: number = 200;
  // rising from far
  static firstHalfCutoff: number =
    TitleAnimation.timeCutoff * TitleAnimation.numTextObjs;
  // receding from near
  static secondHalfCutoff: number =
    2 * TitleAnimation.timeCutoff * TitleAnimation.numTextObjs;

  textObjects: TextObject[] = [];
  text: string;
  farTransformProps: TransformPropsInterface;
  nearTransformProps: TransformPropsInterface;

  private startTime: number;

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

      this.textObjects.forEach((obj) => {
        obj.visible = false;
      });
    }
  }

  update(_: number, time: number) {
    if (!this.startTime) {
      this.startTime = time;
      return;
    }

    // index in textObjects to make visible up to
    let visibleIdx =
      Math.floor((time - this.startTime) / TitleAnimation.timeCutoff) %
      (4 * TitleAnimation.numTextObjs);

    // first half of anim
    if (visibleIdx >= TitleAnimation.numTextObjs) {
      visibleIdx = 2 * TitleAnimation.numTextObjs - visibleIdx;
    }

    for (let i = 0; i < TitleAnimation.numTextObjs; i++) {
      this.textObjects[i].visible = i <= visibleIdx;
    }
  }

  render() {
    this.textObjects.forEach((obj) => {
      obj.visible && obj._render();
    });
  }
}
