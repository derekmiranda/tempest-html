import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { explosion } from "../lib/shapes";
import { renderPoints } from "../lib/utils";
import { COLORS } from "../CONSTS";

export class Explosion extends BaseGameObject implements GameObjectInterface {
  colors: string[] = [COLORS.EXPLOSION1, COLORS.EXPLOSION2, COLORS.EXPLOSION3];
  timeCutoff: number = 200;
  // how many frames in terms of timeCutoff
  numFrames: number = 6;
  // number of explosion layers per frame
  explosionsPerFrame: number[] = [1, 2, 3, 2, 1, 0];
  startTime: number;
  isExploding: boolean = false;
  endExplosionCb: Function;

  constructor(props: GameObjectPropsInterface) {
    super(props);
  }

  initPoints() {
    this.points = explosion();
  }

  update(_, time: number) {
    if (this.isExploding) {
      // end of animation
      if (time - this.startTime > this.timeCutoff * this.numFrames) {
        this.isExploding = false;
        this.endExplosionCb();
        this.destroy();
        return;
      }
      this.renderExplosion(time);
    }
  }

  play(): Promise<void> {
    return new Promise((resolve) => {
      this.startTime = this.game.lastTime;
      this.isExploding = true;
      this.endExplosionCb = resolve;
    });
  }

  renderExplosion(time: number) {
    const animStage = Math.floor((time - this.startTime) / this.timeCutoff);
    const numExplosions = this.explosionsPerFrame[animStage];
    for (let i = 0; i < numExplosions; i++) {
      renderPoints(this, {
        scale: 1 + i * 1.5,
        color: this.colors[i % this.colors.length],
      });
    }
  }
}
