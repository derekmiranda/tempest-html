import { Game } from "./Game";
import { Circle } from "./objects/Circle";
import { Square } from "./objects/Square";
import { Title } from "./scenes/Title";
import { GameEnd } from "./scenes/GameEnd";

let game: Game, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  game = new Game({
    canvas,
    ctx,
    levels: [Circle, Square],
    title: Title,
    gameOver: GameEnd(false),
    win: GameEnd(true),
  });

  game.start();
}
main();
