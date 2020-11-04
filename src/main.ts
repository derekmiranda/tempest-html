import { Point } from "./types";

let canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  running = true,
  layers = [],
  objId = 0;

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

  addObject(SampleObject(ctx), 0);

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
      const shouldUpdate = obj.update(timeDelta);
      if (shouldUpdate) {
        obj.render();
      }
    });
  });
}

function addObject(gameObj, layer) {
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
