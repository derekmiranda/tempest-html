import { BaseGameObject } from "./objects/BaseGameObject";
import { Level } from "./objects/Level";
import { Player } from "./objects/Player";
import { debounce } from "./lib/utils";
import { COLORS } from "./CONSTS";

interface State {
  sceneType: SceneType;
  levelState?: LevelState;
  levelIdx?: number;
}

// TODO: make class
class LayerCollection {
  private layers: BaseGameObject[][] = [];
  // id mapped to serialized string: "layerIdx, objIdxInLayer"
  private objIdMap = {};

  addObject(obj: BaseGameObject, layerIdx: number = 0) {
    if (this.layers[layerIdx]) {
      this.layers[layerIdx].push(obj);
    } else {
      this.layers[layerIdx] = [obj];
    }
    this.objIdMap[obj.id] = layerIdx + "," + (this.layers[layerIdx].length - 1);
  }

  // apply function to all objects in layer collection, in order
  applyFn(fn: Function, filterFn?: Function) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (let j = 0; j < layer.length; j++) {
        if (!filterFn || filterFn(layer[j])) fn(layer[j]);
      }
    }
  }

  removeObject(objId: number) {
    if (this.objIdMap[objId]) {
      const [layerIdx, objIdx] = this.objIdMap[objId].split(",");
      delete this.objIdMap[objId];
      this.layers[layerIdx].splice(objIdx, 1);
    }
  }

  getLayers() {
    return this.layers;
  }
}

interface LevelState {
  idx: number;
  // TODO: enemy state
}

interface GamePropsInterface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  levels: typeof Level[];
  state?: State;
}

// scene types
export enum SceneType {
  LEVEL = "LEVEL",
  TITLE = "TITLE",
  WIN = "WIN",
  GAME_OVER = "GAME_OVER",
}

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  levels: typeof Level[];
  state: State;
  player: Player;

  private layerCollection: LayerCollection;
  private canvasRect: DOMRect;
  private running = true;
  private currLevel: Level;
  private objId = 0;
  private lastTime: number;

  constructor({
    canvas,
    ctx,
    levels,
    state = {
      /* 
    sceneType: SceneType.TITLE
    */
      sceneType: SceneType.LEVEL,
      levelState: {
        idx: 0,
      },
    },
  }: GamePropsInterface) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = state;
    this.levels = levels;
  }

  start() {
    // create player
    this.player = new Player({ ctx: this.ctx, id: this.objId++ });

    // cache canvas rect
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.startScene();

    this.lastTime = Date.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  startScene() {
    // clear layers
    this.layerCollection = new LayerCollection();

    switch (this.state.sceneType) {
      case SceneType.LEVEL:
        this.startLevel();
        break;
    }
  }

  startLevel() {
    const { idx } = this.state.levelState;

    this.currLevel = new this.levels[idx]({
      ctx: this.ctx,
      id: this.objId++,
      // game,
      x: 0,
      y: 0,
      w: 0.65,
      h: 0.65,
    });

    this.layerCollection.addObject(this.currLevel, 0);
    this.layerCollection.addObject(this.player, 1);

    this.layerCollection.applyFn((obj: BaseGameObject) => {
      obj.initPoints();
    });

    this.currLevel.initSpots();
    this.currLevel.setPlayer(this.player);

    this.setListeners();
  }

  handleMouse(e: MouseEvent) {
    this.currLevel.startUpdatingWithCursor(
      e.clientX - this.canvasRect.x,
      e.clientY - this.canvasRect.y
    );
  }

  handleMouseLeave() {
    this.currLevel.stopUpdatingWithCursor();
  }

  setListeners() {
    this.canvas.addEventListener("mouseenter", this.handleMouse.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouse.bind(this));
    this.canvas.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );

    const resizeHandler: any = debounce(function () {
      // recache canvas rect
      this.canvasRect = this.canvas.getBoundingClientRect();
    }, 200);
    window.addEventListener("resize", resizeHandler);
  }

  gameLoop(time) {
    if (this.running) {
      // skip first cycle to initialize lastTime
      if (!this.lastTime) {
        this.lastTime = time;
      } else {
        const timeDelta = time - this.lastTime;
        this.lastTime = time;
        this.draw(timeDelta, time);
      }
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  draw(timeDelta: number, time: number) {
    this.ctx.fillStyle = COLORS.BG;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.layerCollection.applyFn((obj: BaseGameObject) => {
      obj._update(timeDelta, time);
      obj._render();
    });
  }

  updateState(newState: State) {
    let updateScene = newState.sceneType !== this.state.sceneType;
    this.state = newState;

    if (updateScene) {
      this.startScene();
    }
  }
}
