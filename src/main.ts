import { Point } from "./types";

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

// define geometry as relative to unit square
const CENTER: Point = {
  x: 0.5,
  y: 0.6,
};
const COLORS = {
  BG: "black",
  RED: "tomato",
  LINE: "blue",
};

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  draw();
}

function draw() {
  ctx.fillStyle = COLORS.BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO: establish scenes and how to load them
  drawCircle({ x: 0.5, y: 0.5 }, 0.35, 16);
}

function drawCircle(
  origin: Point,
  radius: number,
  segments: number = 16
): void {
  const segmentAngle: number = (2 * Math.PI) / segments;

  let firstX: number, firstY: number;

  ctx.strokeStyle = COLORS.LINE;
  ctx.beginPath();
  for (let i = 0; i < segments; i++) {
    const angle = segmentAngle * i;

    const x = origin.x + radius * Math.cos(angle),
      y = origin.y + radius * Math.sin(angle);

    if (i === 0) {
      firstX = x;
      firstY = y;
      ctx.moveTo(x * canvas.width, y * canvas.height);
    } else {
      ctx.lineTo(x * canvas.width, y * canvas.height);
    }
  }
  ctx.lineTo(firstX * canvas.width, firstY * canvas.height);
  ctx.closePath();
  ctx.stroke();
}

main();
