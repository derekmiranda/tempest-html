import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { Bullet } from "./Bullet";
import { Level } from "./Level";
import { throttle } from "../lib/utils";
import { player } from "../lib/shapes";

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
    this.fireBullet = throttle(this._fireBullet.bind(this), 150);
  }

  initPoints() {
    this.points = player();
  }

  _fireBullet() {
    const bulletTf = this.level.getBulletPath();
    const laneIdx = this.level.getPlayerSpotIdx();
    const bullet = new Bullet({
      game: this.game,
      ctx: this.ctx,
      level: this.level,
      laneIdx,
      parent: this.parent,
      ...bulletTf.to,
      ...bulletTf,
      w: 0.05,
      h: 0.05,
    });
    this.level.addBullet(bullet, laneIdx);
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
    this.points.forEach((p, i) => {
      i === 0 ? this.localMoveTo(p.x, p.y) : this.localLineTo(p.x, p.y);
    });
    this.ctx.closePath();
    this.ctx.stroke();
  }

  setLevel(level) {
    this.level = level;
  }
}
