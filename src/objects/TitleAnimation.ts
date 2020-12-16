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

    // determine animation phase

    // repeat

    const dt = time - this.startTime;
    const phaseCutoff = TitleAnimation.timeCutoff * TitleAnimation.numTextObjs;
    const phase = Math.floor(dt / phaseCutoff) % 4;

    let startIdx, endIdx;
    const baseIdx =
      Math.floor(dt / TitleAnimation.timeCutoff) % TitleAnimation.numTextObjs;

    // 0. no objects visible -> turn on from far
    if (phase === 0) {
      startIdx = 0;
      endIdx = baseIdx;
    }
    // 1. all objects visible now -> turn off from far
    else if (phase === 1) {
      startIdx = baseIdx;
      endIdx = TitleAnimation.numTextObjs - 1;
    }
    // 2. only nearest visible -> turn on from near
    else if (phase === 2) {
      startIdx = TitleAnimation.numTextObjs - baseIdx;
      endIdx = TitleAnimation.numTextObjs - 1;
    }
    // 3. all visible -> turn off from near
    else {
      startIdx = 0;
      endIdx = TitleAnimation.numTextObjs - baseIdx;
    }

    for (let i = 0; i < TitleAnimation.numTextObjs; i++) {
      let visible =
        (i >= startIdx && i <= endIdx) ||
        // is nearest in phase 2
        (phase === 2 && i === TitleAnimation.numTextObjs - 1);
      this.textObjects[i].visible = visible;
    }
  }

  render() {
    this.textObjects.forEach((obj) => {
      obj.visible && obj._render();
    });
  }
}
