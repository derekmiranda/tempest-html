import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { Bullet } from "./Bullet";
import { Level } from "./Level";
import { throttle } from "../lib/utils";

interface PlayerPropsInterface extends GameObjectPropsInterface {
  color?: string;
}

export class Player extends BaseGameObject implements GameObjectInterface {
  level: Level;
  color: string;
  fireBullet: Function;
  isFiring: boolean;

  constructor(props: PlayerPropsInterface) {
    super(props);
    if (!this.color) {
      this.color = COLORS.PLAYER;
    }
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    this.enableFiring = this.enableFiring.bind(this);
    this.disableFiring = this.disableFiring.bind(this);
    this.fireBullet = throttle(this._fireBullet.bind(this), 200);
  }

  _fireBullet() {
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

  keydown(e) {
    if (e.code === "Space") {
      this.enableFiring();
    }
  }

  keyup(e) {
    if (e.code === "Space") {
      this.disableFiring();
    }
  }

  enableFiring() {
    this.isFiring = true;
  }

  disableFiring() {
    this.isFiring = false;
  }

  setListeners() {
    window.addEventListener("keydown", this.keydown, true);
    window.addEventListener("keyup", this.keyup, true);
    this.ctx.canvas.addEventListener("mousedown", this.enableFiring, true);
    this.ctx.canvas.addEventListener("mouseup", this.disableFiring, true);
  }

  removeListeners() {
    window.removeEventListener("keydown", this.keydown, true);
    window.removeEventListener("keyup", this.keyup, true);
    this.ctx.canvas.removeEventListener("mousedown", this.enableFiring, true);
    this.ctx.canvas.removeEventListener("mouseup", this.disableFiring, true);
  }

  update() {
    if (this.isFiring) this.fireBullet();
  }

  render() {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.localMoveTo(-0.25, -0.25);
    this.localLineTo(-0.5, 0);
    this.localLineTo(0, 0.3);
    this.localLineTo(0.5, 0);
    this.localLineTo(0.25, -0.25);
    this.localLineTo(0.4, 0);
    this.localLineTo(0, 0.1);
    this.localLineTo(-0.4, 0);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  setLevel(level) {
    this.level = level;
  }
}
