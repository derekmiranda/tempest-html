import { Player } from "./objects/Player";
import { Circle } from "./objects/Circle";
import { Point } from "./types";
import { CENTER, COLORS } from "./CONSTS";
import { centerDims } from "./utils";

let canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  running = true,
  layers = [],
  objId = 0;

function main() {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  const circ = new Circle({
    ctx,
    x: 0,
    y: 0,
    w: 0.8,
    h: 0.8,
  });
  const player = new Player({
    ctx,
    x: -0.25,
    y: -0.25,
    w: 0.5,
    h: 0.5,
    parent: circ,
  });

  addObject(circ);
  addObject(player);

  requestAnimationFrame(gameLoop);
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

function SampleObject(ctx) {
  let x = 1;
  const speed = 0.1; // pixel per ms

  return {
    render() {
      ctx.fillStyle = COLORS.RED;
      ctx.fillRect(x, 200, 10, 10);
    },
    update(timeDelta: number): Boolean {
      x += timeDelta * speed;
      return true;
    },
  };
}

main();
