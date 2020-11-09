import { Player } from "./objects/Player";
import { Circle } from "./objects/Circle";
import { Point } from "./types";
import { COLORS } from "./CONSTS";
import { centerDims } from "./utils";
import { Level } from "./objects/Level";

let canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  running = true,
  currLevel: Level,
  layers = [],
  objId = 0;

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  const circ = (currLevel = new Circle({
    ctx,
    x: 0,
    y: 0,
    w: 0.8,
    h: 0.8,
  }));
  const player = new Player({ ctx });

  circ.setPlayer(player);

  addObject(circ);
  addObject(player);

  setListeners();

  requestAnimationFrame(gameLoop);
}

function setListeners() {
  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") currLevel.updatePlayerSpot(-1);
    else if (e.code === "ArrowRight") currLevel.updatePlayerSpot(1);
  });
}

let lastTime;
function gameLoop(time) {
  if (running) {
    // skip first cycle to initialize lastTime
    if (!lastTime) {
      lastTime = time;
    } else {
      const timeDelta = time - lastTime;
      lastTime = time;
      draw(timeDelta);
    }
    requestAnimationFrame(gameLoop);
  }
}

function draw(timeDelta: number) {
  ctx.fillStyle = COLORS.BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  layers.forEach((collection) => {
    Object.values(collection).forEach((obj: any) => {
      obj.update && obj.update(timeDelta);
      obj.render();
    });
  });
}

function addObject(gameObj, layer = 0) {
  if (layers[layer]) {
    layers[layer][objId++] = gameObj;
  } else {
    layers[layer] = { [objId++]: gameObj };
  }
}

main();
