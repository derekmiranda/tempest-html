import FontFaceObserver from "fontfaceobserver";
const MobileDetect = require("mobile-detect");

import { Game } from "./Game";
import { Circle } from "./objects/Circle";
import { Square } from "./objects/Square";
import { Plus } from "./objects/Plus";
import { Title } from "./scenes/Title";
import { GameEnd } from "./scenes/GameEnd";

let game: Game, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  updateDescription();

  game = new Game({
    canvas,
    ctx,
    levels: [Circle, Square, Plus],
    title: Title,
    gameOver: GameEnd(false),
    win: GameEnd(true),
  });

  game.start();
}

function updateDescription() {
  const desc: HTMLElement = document.getElementById("description");
  const md = new MobileDetect(window.navigator.userAgent);
  const mobileControls = `
    <p>Tap or drag to move ship to that point</p>
    <p>Hold finger/point at point to fire at enemy ships and bullets</p> 
  `;
  const desktopControls = `
    <p>Move mouse to control ship</p>
    <p>Hold left mouse button or Spacebar to fire at enemy ships and bullets</p> 
  `;

  desc.innerHTML = `
    <h1>Williwaw</h1>
    <p>Journey through space as you battle evil geometry!</p>
    ${md.mobile() ? mobileControls : desktopControls}
    <p>If enemies get close to you, shoot right before they touch you to destroy them first!</p>
  `;
}

function loadFont(): Promise<void> {
  const font = new FontFaceObserver("VectorBattle");
  return font.load();
}

loadFont().then(main);
