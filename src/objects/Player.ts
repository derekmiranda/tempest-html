import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { Bullet } from "./Bullet";
import { Level } from "./Level";

interface PlayerPropsInterface extends GameObjectPropsInterface {
  color?: string;
}

export class Player extends BaseGameObject implements GameObjectInterface {
  level: Level;
  color: string;

  constructor(props: PlayerPropsInterface) {
    super(props);
    if (!this.color) {
      this.color = COLORS.PLAYER;
    }
    this.keydown = this.keydown.bind(this);
  }

  keydown(e) {
    if (e.code === "Space") {
      const bulletTf = this.level.getBulletPath();
      const bullet = new Bullet({
        game: this.game,
        ctx: this.ctx,
        parent: this.parent,
        ...bulletTf.to,
        ...bulletTf,
        w: 0.05,
        h: 0.05,
      });
      this.game.addObject(bullet, this.layer);
    }
  }

  setListeners() {
    window.addEventListener("keydown", this.keydown, true);
  }

  removeListeners() {
    window.removeEventListener("keydown", this.keydown, true);
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.localMoveTo(0, -0.5);
    this.localLineTo(0.5, 0.5);
    this.localLineTo(-0.5, 0.5);
    this.ctx.closePath();
    this.ctx.fill();
  }

  setLevel(level) {
    this.level = level;
  }
}
