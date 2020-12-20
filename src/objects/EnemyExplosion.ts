import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { AsyncAction } from "../lib/AsyncAction";
import { renderPoints } from "../lib/utils";

export class EnemyExplosion extends BaseGameObject
  implements GameObjectInterface {
  color: string = "white";
  timeCutoff: number = 75;
  // how many frames in terms of timeCutoff
  numFrames: number = 4;
  // scale values on each frame
  scalePerFrame: number[] = [0.25, 0.5, 0.75, 1];
  startTime: number;
  explosionAnim: AsyncAction = new AsyncAction();

  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = [
      // 0 deg
      { x: 0.5, y: 0 },
      { x: -0.5, y: 0 },
      // 45 deg
      { x: 0.354, y: -0.354 },
      { x: -0.354, y: 0.354 },
      // 00 deg
      { x: 0, y: -0.5 },
      { x: 0, y: 0.5 },
      // 135 deg
      { x: -0.354, y: -0.354 },
      { x: 0.354, y: 0.354 },
    ];
  }

  update(_, time: number) {
    if (this.explosionAnim.active) {
      // end of animation
      if (time - this.startTime > this.timeCutoff * this.numFrames) {
        this.explosionAnim.complete();
        this.destroy();
        return;
      }
      this.renderExplosion(time);
    }
  }

  play(): Promise<void> {
    this.startTime = this.game.lastTime;
    return this.explosionAnim.start();
  }

  renderExplosion(time: number) {
    const frame = Math.floor((time - this.startTime) / this.timeCutoff);
    const scale = this.scalePerFrame[frame];
    for (let i = 0; i < this.points.length; i++) {
      const points = this.points.slice(i * 2, (i + 1) * 2);
      renderPoints(this, {
        points,
        scale,
        color: this.color,
      });
    }
  }
}
