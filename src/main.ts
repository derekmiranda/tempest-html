import { Game } from "./Game";
import { Circle } from "./objects/Circle";
import { Square } from "./objects/Square";
import { Plus } from "./objects/Plus";
import { Title } from "./scenes/Title";
import { GameEnd } from "./scenes/GameEnd";
import FontFaceObserver from "fontfaceobserver";

let game: Game, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

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

function loadFont(): Promise<void> {
  const font = new FontFaceObserver("VectorBattle");
  return font.load();
}

loadFont().then(main);
