import { Player } from "./objects/Player";
import { Bullet } from "./objects/Bullet";
import { Circle } from "./objects/Circle";
import { Square } from "./objects/Square";
import { COLORS } from "./CONSTS";
import { debounce } from "./lib/utils";
import { Level } from "./objects/Level";
import { BaseGameObject } from "./objects/BaseGameObject";

let canvas: HTMLCanvasElement,
  canvasRect: DOMRect,
  ctx: CanvasRenderingContext2D,
  running = true,
  currLevel: Level,
  layers = [],
  objId = 0,
  lastTime: number;

function startNewLevel({ Level = Circle } = {}) {
  canvas = document.getElementById("game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  // cache canvas rect
  canvasRect = canvas.getBoundingClientRect();

  currLevel = new Level({
    ctx,
    x: 0,
    y: 0,
    w: 0.65,
    h: 0.65,
  });
  const player = new Player({ ctx });
  const bullet = new Bullet({ ctx, w: 0.05, h: 0.05, z: 1 });

  addObject(currLevel);
  addObject(player);
  addObject(bullet);

  // initializes each objects point to render
  layers.forEach((layer) => {
    Object.values(layer).forEach((obj: BaseGameObject) => {
      obj.initPoints();
    });
  });
  currLevel.initSpots();
  currLevel.setPlayer(player);

  setListeners();

  lastTime = Date.now();
  requestAnimationFrame(gameLoop);
}
startNewLevel();

function handleMouse(e: MouseEvent) {
  currLevel.startUpdatingWithCursor(
    e.clientX - canvasRect.x,
    e.clientY - canvasRect.y
  );
}

function handleMouseLeave() {
  currLevel.stopUpdatingWithCursor();
}

function setListeners() {
  canvas.addEventListener("mouseenter", handleMouse);
  canvas.addEventListener("mousemove", handleMouse);
  canvas.addEventListener("mouseleave", handleMouseLeave);

  const resizeHandler: any = debounce(function () {
    // recache canvas rect
    canvasRect = canvas.getBoundingClientRect();
  }, 200);
  window.addEventListener("resize", resizeHandler);
}

function gameLoop(time) {
  if (running) {
    // skip first cycle to initialize lastTime
    if (!lastTime) {
      lastTime = time;
    } else {
      const timeDelta = time - lastTime;
      lastTime = time;
      draw(timeDelta, time);
    }
    requestAnimationFrame(gameLoop);
  }
}

function draw(timeDelta: number, time: number) {
  ctx.fillStyle = COLORS.BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  layers.forEach((collection) => {
    Object.values(collection).forEach((obj: any) => {
      obj._update(timeDelta, time);
      obj._render();
    });
  });
}

function addObject(gameObj, layer = 0) {
  if (layers[layer]) {
    layers[layer][objId++] = gameObj;
  } else {
    layers[layer] = { [objId++]: gameObj };
  }

  // add any children
  for (let child of gameObj.children) {
    addObject(child, layer);
  }
}
