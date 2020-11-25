import { GameObjectPropsInterface, VoidFunction } from "./types";
import { BaseGameObject } from "./objects/BaseGameObject";
import { Level } from "./objects/Level";
import { Player } from "./objects/Player";
import { debounce } from "./lib/utils";
import { COLORS, MAX_ID } from "./CONSTS";
import { Enemy } from "./objects/Enemy";
import { RedEnemy } from "./objects/RedEnemy";
import { EnemySpawner } from "./objects/EnemySpawner";

interface State {
  sceneType: SceneType;
  levelState?: LevelState;
  levelIdx?: number;
}

interface Layer {
  [id: string]: BaseGameObject;
}

class LayerCollection {
  private layers: Layer[] = [];
  // id mapped to serialized string: "layerIdx, objIdxInLayer"
  private objIdMap = {};

  addObject(obj: BaseGameObject, layerIdx: number = 0) {
    // object already added
    if (this.objIdMap[obj.id]) return;

    if (this.layers[layerIdx]) {
      this.layers[layerIdx][obj.id] = obj;
    } else {
      this.layers[layerIdx] = { [obj.id]: obj };
    }
    this.objIdMap[obj.id] = layerIdx;
  }

  removeObject(obj: BaseGameObject) {
    if (this.objIdMap[obj.id] !== undefined) {
      const layerIdx = this.objIdMap[obj.id];
      delete this.objIdMap[obj.id];
      delete this.layers[layerIdx][obj.id];
    }
  }

  // apply function to all objects in layer collection, in order
  applyFn(fn: Function, filterFn?: Function) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      Object.values(layer).forEach((obj) => {
        if (!filterFn || filterFn(obj)) fn(obj);
      });
    }
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
  private objId = -1;
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
    this.player = new Player(this.getDefaultProps());

    // cache canvas rect
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.startScene();

    this.setListeners();

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
      ...this.getDefaultProps(),
      x: 0,
      y: 0,
      w: 0.65,
      h: 0.65,
    });

    this.addObject(this.currLevel, 0);

    this.currLevel.initPlayerSpots();
    this.currLevel.setPlayer(this.player);
    this.currLevel.startSpawning();
  }

  addObject(obj: BaseGameObject, layer: number = 0) {
    if (obj.id === undefined) obj.id = this.getNewObjId();

    obj.setRenderedState(true);
    this.layerCollection.addObject(obj, layer);
    obj.initPoints();
    obj.setListeners();
    obj.setLayer(layer);

    for (let child of obj.children) {
      this.addObject(child, layer);
    }
  }

  removeObject(obj) {
    this.layerCollection.removeObject(obj);
    obj.removeListeners();

    for (let child of obj.children) {
      this.removeObject(child);
    }
  }

  // listeners
  handleMouse(e: MouseEvent) {
    if (!this.currLevel) return;
    this.currLevel.startUpdatingWithCursor(
      e.clientX - this.canvasRect.x,
      e.clientY - this.canvasRect.y
    );
  }

  handleMouseLeave() {
    if (!this.currLevel) return;
    this.currLevel.stopUpdatingWithCursor();
  }

  setListeners() {
    this.canvas.addEventListener("mouseenter", this.handleMouse.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouse.bind(this));
    this.canvas.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );

    const resizeHandler: VoidFunction = debounce(function () {
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

  // util for getting default Game Object props
  getDefaultProps(): GameObjectPropsInterface {
    return {
      game: this,
      ctx: this.ctx,
      id: this.getNewObjId(),
    };
  }

  getNewObjId() {
    if (this.objId < MAX_ID) {
      this.objId += 1;
    } else {
      this.objId = 0;
    }
    return this.objId;
  }
}
