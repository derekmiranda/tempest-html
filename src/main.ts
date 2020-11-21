import { Game } from "./Game";
import { Circle } from "./objects/Circle";
import { Square } from "./objects/Square";

let game: Game, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  game = new Game({
    canvas,
    ctx,
    levels: [Circle, Square],
  });

  game.start();
}
main();
