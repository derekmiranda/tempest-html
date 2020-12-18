import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { BULLET_SIZE, COLORS } from "../CONSTS";
import { Bullet } from "./Bullet";
import { Level } from "./Level";
import { renderPoints, sleep, throttle, debounce } from "../lib/utils";
import { player } from "../lib/shapes";
import { Explosion } from "./Explosion";
import { SceneType } from "../Game";

interface PlayerPropsInterface extends GameObjectPropsInterface {
  color?: string;
}

export class Player extends BaseGameObject implements GameObjectInterface {
  static bulletsPerBurst: number = 5;
  level: Level;
  color: string = COLORS.PLAYER;
  fireBullet: Function;
  isFiring: boolean;
  isAlive: boolean = true;
  isExploding: boolean = false;

  constructor(props: PlayerPropsInterface) {
    super(props);
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    this.enableFiring = this.enableFiring.bind(this);
    this.disableFiring = this.disableFiring.bind(this);
    this.touchstart = this.touchstart.bind(this);
    this.touchend = this.touchend.bind(this);
    this.fireBullet = throttle(this._fireBullet.bind(this), 500);
  }

  initPoints() {
    this.points = player();
  }

  async _fireBullet() {
    for (let i = 0; i < Player.bulletsPerBurst && this.isFiring; i++) {
      this._spawnBullet();
      if (i < Player.bulletsPerBurst - 1) await sleep(50);
    }
  }

  _spawnBullet() {
    const bulletTf = this.level.getBulletPath();
    const laneIdx = this.level.getPlayerSpotIdx();
    const bullet = new Bullet({
      ...this.game.getDefaultProps(),
      level: this.level,
      laneIdx,
      parent: this.parent,
      ...bulletTf.to,
      ...bulletTf,
      w: BULLET_SIZE,
      h: BULLET_SIZE,
    });
    this.level.addBullet(bullet, laneIdx);
    this.game.addObject(bullet, this.layer);
  }

  keydown(e) {
    e.preventDefault();
    if (e.code === "Space") {
      this.enableFiring();
    }
  }

  keyup(e) {
    e.preventDefault();
    if (e.code === "Space") {
      this.disableFiring();
    }
  }

  enableFiring() {
    this.isFiring =
      !this.level.levelStartAnim.active && !this.level.levelWonAnim.active;
  }

  disableFiring() {
    this.isFiring = false;
  }

  async onDeath() {
    if (!this.isAlive) return;

    this.isExploding = true;
    this.setAliveState(false);
    this.destroy();

    // explode
    const explosion = new Explosion({
      ...this.game.getDefaultProps(),
      x: this.transform.x,
      y: this.transform.y,
      w: 0.08,
      h: 0.08,
    });
    this.game.addObject(explosion, 1);
    this.level.addChildren(explosion);
    await explosion.play();
    this.isExploding = false;

    // game over
    if (this.game.state.levelState.lives === 0) {
      await sleep(1000);
      await this.level.onGameOver();
      await sleep(500);
      this.game.updateState({
        sceneType: SceneType.GAME_OVER,
      });
      this.game.startScene();
    }
    // lost life
    else {
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
    this.ctx.canvas.addEventListener("touchstart", this.touchstart, true);
    this.ctx.canvas.addEventListener("touchend", this.touchend, true);
  }

  removeListeners() {
    window.removeEventListener("keydown", this.keydown, true);
    window.removeEventListener("keyup", this.keyup, true);
    this.ctx.canvas.removeEventListener("mousedown", this.enableFiring, true);
    this.ctx.canvas.removeEventListener("mouseup", this.disableFiring, true);
    this.ctx.canvas.removeEventListener("touchstart", this.touchstart, true);
    this.ctx.canvas.removeEventListener("touchend", this.touchend, true);
  }

  touchstart(e) {
    e.preventDefault();
    this.enableFiring();
  }

  touchend(e) {
    e.preventDefault();
    this.disableFiring();
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
