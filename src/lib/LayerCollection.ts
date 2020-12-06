import { BaseGameObject } from "../objects/BaseGameObject";

interface Layer {
  [id: string]: BaseGameObject;
}

export class LayerCollection {
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
