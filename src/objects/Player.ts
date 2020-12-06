import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { COLORS } from "../CONSTS";
import { Bullet } from "./Bullet";
import { Level } from "./Level";
import { renderPoints, sleep, throttle } from "../lib/utils";
import { player } from "../lib/shapes";

interface PlayerPropsInterface extends GameObjectPropsInterface {
  color?: string;
}

export class Player extends BaseGameObject implements GameObjectInterface {
  level: Level;
  color: string = COLORS.PLAYER;
  fireBullet: Function;
  isFiring: boolean;
  isAlive: boolean = true;

  constructor(props: PlayerPropsInterface) {
    super(props);
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
      ...this.game.getDefaultProps(),
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

  async onDeath() {
    this.setAliveState(false);
    this.destroy();

    // game over
    if (this.game.state.levelState.lives === 0) {
      await sleep(500);
      await this.level.onGameOver();
      await sleep(300);
      this.game.restart();
    }
    // lost life
    else {
      // wait for death anim to finish
      await sleep(500);
      this.game.updateState({
        levelState: {
          lives: this.game.state.levelState.lives - 1,
        },
      });
    }
    this.game.startScene();
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
    renderPoints(this);
  }

  setLevel(level) {
    this.level = level;
  }

  setAliveState(state: boolean) {
    this.isAlive = state;
  }
}
