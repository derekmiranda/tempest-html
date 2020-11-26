// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"lib/matrix.ts":[function(require,module,exports) {
"use strict"; // borrowed from https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrix = void 0; // TODO: convert to TS/ES6 module

exports.matrix = {
  projection: function projection(width, height) {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
  },
  identity: function identity() {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  },
  translation: function translation(tx, ty) {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },
  rotation: function rotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },
  scaling: function scaling(sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },
  multiply: function multiply(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    a[0] = b00 * a00 + b01 * a10 + b02 * a20;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22;
    a[3] = b10 * a00 + b11 * a10 + b12 * a20;
    a[4] = b10 * a01 + b11 * a11 + b12 * a21;
    a[5] = b10 * a02 + b11 * a12 + b12 * a22;
    a[6] = b20 * a00 + b21 * a10 + b22 * a20;
    a[7] = b20 * a01 + b21 * a11 + b22 * a21;
    a[8] = b20 * a02 + b21 * a12 + b22 * a22;
  },
  cloneMultiply: function cloneMultiply(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [b00 * a00 + b01 * a10 + b02 * a20, b00 * a01 + b01 * a11 + b02 * a21, b00 * a02 + b01 * a12 + b02 * a22, b10 * a00 + b11 * a10 + b12 * a20, b10 * a01 + b11 * a11 + b12 * a21, b10 * a02 + b11 * a12 + b12 * a22, b20 * a00 + b21 * a10 + b22 * a20, b20 * a01 + b21 * a11 + b22 * a21, b20 * a02 + b21 * a12 + b22 * a22];
  },
  translate: function translate(m, tx, ty) {
    return exports.matrix.multiply(m, exports.matrix.translation(tx, ty));
  },
  rotate: function rotate(m, angleInRadians) {
    return exports.matrix.multiply(m, exports.matrix.rotation(angleInRadians));
  },
  scale: function scale(m, sx, sy) {
    return exports.matrix.multiply(m, exports.matrix.scaling(sx, sy));
  },
  transformPoint: function transformPoint(m, x, y) {
    var newX = m[0] * x + m[3] * y + m[6];
    var newY = m[1] * x + m[4] * y + m[7];
    return {
      x: newX,
      y: newY
    };
  },
  deriveAngle: function deriveAngle(m) {
    // m[1][0] should be sin(angle)
    return Math.asin(m[3]);
  }
};
},{}],"CONSTS.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_ID = exports.BULLET_TOLERANCE = exports.BULLET_SPEED = exports.RED_ENEMY_SPEED = exports.COLORS = exports.COLLISION_TOLERANCE = exports.ENEMY_TO_LEVEL_SIZE = exports.PLAYER_TO_LEVEL_SIZE = exports.PLAYER_TO_LEVEL_DIST = exports.FAR_SCALE = exports.LEVEL_CENTER = exports.AVG_FRAME_TIME = void 0; // 60 fps

exports.AVG_FRAME_TIME = 1 / 60; // define geometry as relative to unit square

exports.LEVEL_CENTER = {
  x: 0,
  y: 0.1
}; // scale to apply on far level shape

exports.FAR_SCALE = 0.1; // padding b/w player and line on level w.r.t. level-space

exports.PLAYER_TO_LEVEL_DIST = 0;
exports.PLAYER_TO_LEVEL_SIZE = 0.2;
exports.ENEMY_TO_LEVEL_SIZE = 0.2; // z-value tolerance for collisions

exports.COLLISION_TOLERANCE = 0.03;
exports.COLORS = {
  BG: "black",
  PLAYER: "yellow",
  BULLET: "pink",
  RED: "tomato",
  LINE: "blue"
};
exports.RED_ENEMY_SPEED = 0.00015;
exports.BULLET_SPEED = 0.003;
exports.BULLET_TOLERANCE = 1500 * exports.BULLET_SPEED * exports.AVG_FRAME_TIME;
exports.MAX_ID = Number.MAX_SAFE_INTEGER;
},{}],"objects/Transform.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = void 0;

var CONSTS_1 = require("../CONSTS");

var matrix_1 = require("../lib/matrix");

var Transform =
/** @class */
function () {
  function Transform(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.x,
        x = _c === void 0 ? 0 : _c,
        _d = _b.y,
        y = _d === void 0 ? 0 : _d,
        _e = _b.z,
        z = _e === void 0 ? 0 : _e,
        _f = _b.w,
        w = _f === void 0 ? 1 : _f,
        _g = _b.h,
        h = _g === void 0 ? 1 : _g,
        _h = _b.angle,
        angle = _h === void 0 ? 0 : _h;

    this.matrix = matrix_1.matrix.identity();
    this.angle = 0;
    this.setTransformWithProps({
      x: x,
      y: y,
      z: z,
      w: w,
      h: h,
      angle: angle
    });
  }

  Transform.prototype.getMatrix = function () {
    return this.matrix;
  };

  Transform.prototype.setMatrix = function (m, shouldUpdateProps) {
    if (shouldUpdateProps === void 0) {
      shouldUpdateProps = false;
    }

    this.matrix = m;

    if (shouldUpdateProps) {
      this.updateTransformProps();
    }
  };

  Transform.prototype.setTransformWithProps = function (_a) {
    var x = _a.x,
        y = _a.y,
        w = _a.w,
        z = _a.z,
        h = _a.h,
        angle = _a.angle;
    var newMat = matrix_1.matrix.identity(); // apply translation

    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    matrix_1.matrix.translate(newMat, this.x, this.y); // update z

    if (z !== undefined) this.z = z; // apply rotation

    if (angle !== undefined) this.angle = angle;

    if (this.angle >= Math.PI * 2) {
      this.angle = this.angle / (Math.PI * 2) % 1;
    }

    matrix_1.matrix.rotate(newMat, this.angle); // apply scale with z-scaling

    var zScale = 1 - (1 - CONSTS_1.FAR_SCALE) * this.z;
    if (w !== undefined) this.w = w;
    if (h !== undefined) this.h = h;
    matrix_1.matrix.scale(newMat, this.w * zScale, this.h * zScale);
    this.matrix = newMat;
  };

  Transform.prototype.getTransformProps = function () {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
      h: this.h,
      angle: this.angle
    };
  };

  Transform.prototype.updateWithProps = function (_a) {
    var x = _a.x,
        y = _a.y,
        w = _a.w,
        z = _a.z,
        h = _a.h,
        angle = _a.angle; // apply translation

    if (x || y) {
      // cache xy
      if (x !== undefined) this.x += x;
      if (y !== undefined) this.y += y;
      matrix_1.matrix.translate(this.matrix, this.x, this.y);
    } // apply rotation


    if (angle !== undefined) {
      // cache angle
      this.angle += angle;

      if (this.angle >= Math.PI * 2) {
        this.angle = this.angle / (Math.PI * 2) % 1;
      }

      matrix_1.matrix.rotate(this.matrix, angle);
    } // apply z


    if (z !== undefined) this.z += z; // apply scale and z

    if (w || h) {
      if (w !== undefined) this.w *= w;
      if (h !== undefined) this.h *= h;
      var zScale = 1 - (1 - CONSTS_1.FAR_SCALE) * this.z;
      matrix_1.matrix.scale(this.matrix, this.w * zScale, this.h * zScale);
    }
  };

  Transform.prototype.updateWithMatrix = function (m, shouldUpdateProps) {
    if (shouldUpdateProps === void 0) {
      shouldUpdateProps = false;
    }

    matrix_1.matrix.multiply(this.matrix, m);

    if (shouldUpdateProps) {
      this.updateTransformProps();
    }
  }; // calculates transform properties based on current matrix


  Transform.prototype.updateTransformProps = function () {
    this.x = this.matrix[6];
    this.y = this.matrix[7];
    this.angle = matrix_1.matrix.deriveAngle(this.matrix);
    var cosAngle = Math.cos(this.angle);
    this.w = this.matrix[0] / cosAngle;
    this.h = this.matrix[4] / cosAngle;
  };

  return Transform;
}();

exports.Transform = Transform;
},{"../CONSTS":"CONSTS.ts","../lib/matrix":"lib/matrix.ts"}],"objects/BaseGameObject.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseGameObject = void 0;

var matrix_1 = require("../lib/matrix");

var Transform_1 = require("./Transform");

var BaseGameObject =
/** @class */
function () {
  function BaseGameObject(props) {
    this.children = [];
    this.points = [];
    this.rendered = false;
    Object.assign(this, props);
    this.transform = new Transform_1.Transform(props);
    this.updateGlobalTransform();
  } // sets this.points


  BaseGameObject.prototype.initPoints = function () {
    this.points = [];
  }; // sets event listeners


  BaseGameObject.prototype.setListeners = function () {}; // remove event listeners


  BaseGameObject.prototype.removeListeners = function () {}; // render and update
  // write render and update function on classes extended BaseGameObject
  // _render and _update are used internally by game loop


  BaseGameObject.prototype._render = function () {
    this.render();
  };

  BaseGameObject.prototype.render = function () {};

  BaseGameObject.prototype._update = function (timeDelta, time) {
    if (timeDelta < 0) return;
    this.update(timeDelta, time);
  };

  BaseGameObject.prototype.update = function (timeDelta, time) {};

  BaseGameObject.prototype.setParent = function (parent) {
    this.parent = parent;
    this.updateGlobalTransform();
  };

  BaseGameObject.prototype.addChildren = function (children) {
    if (!Array.isArray(children)) children = [children];

    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
      var child = children_1[_i];
      child.setParent(this);
      this.children.push(child);

      if (this.rendered) {
        this.game.addObject(child);
      }
    }
  };

  BaseGameObject.prototype.removeChild = function (child) {
    var childIdx = this.children.indexOf(child);
    if (childIdx > 0) this.children.splice(childIdx, 1);
  }; // base destroy method


  BaseGameObject.prototype._destroy = function () {
    this.rendered = false;
    this.game.removeObject(this);

    if (this.parent) {
      this.parent.removeChild(this);
    }
  };

  BaseGameObject.prototype.destroy = function () {
    this._destroy();
  };

  BaseGameObject.prototype.updateTransformWithProps = function (props) {
    this.transform.updateWithProps(props);
    this.updateGlobalTransform();
  };

  BaseGameObject.prototype.setTransformWithProps = function (props) {
    this.transform.setTransformWithProps(props);
    this.updateGlobalTransform();
  }; // updates transformation matrix relative to whole canvas
  // and children's as well


  BaseGameObject.prototype.updateGlobalTransform = function () {
    this.globalTransform = new Transform_1.Transform();
    this.globalTransform.updateWithProps(this.transform.getTransformProps());

    if (this.parent) {
      // TODO: update translation w/ z
      // update global transform w/ parent's global transform
      var parentGlobalMat = this.parent.globalTransform.getMatrix();
      var parentGlobalProps = this.parent.globalTransform.getTransformProps();
      this.globalTransform.updateWithProps(parentGlobalProps);

      var _a = this.transform.getTransformProps(),
          x = _a.x,
          y = _a.y,
          z = _a.z;

      var newTranslateX = parentGlobalMat[0] * x + parentGlobalMat[3] * y + parentGlobalProps.x;
      var newTranslateY = parentGlobalMat[1] * x + parentGlobalMat[4] * y + parentGlobalProps.y;
      this.globalTransform.setTransformWithProps({
        x: newTranslateX,
        y: newTranslateY,
        z: z
      });
    } // and children's matrices


    for (var _i = 0, _b = this.children; _i < _b.length; _i++) {
      var child = _b[_i];
      child.updateGlobalTransform();
    }
  };

  BaseGameObject.prototype.normalizePoints = function (relX, relY) {
    return {
      x: this.ctx.canvas.width * (relX + 0.5),
      y: this.ctx.canvas.height * (relY + 0.5)
    };
  };

  BaseGameObject.prototype.localLineTo = function (localX, localY) {
    var resolved = matrix_1.matrix.transformPoint(this.globalTransform.getMatrix(), localX, localY);
    var normalized = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.lineTo(normalized.x, normalized.y);
  };

  BaseGameObject.prototype.localMoveTo = function (localX, localY) {
    var resolved = matrix_1.matrix.transformPoint(this.globalTransform.getMatrix(), localX, localY);
    var normalized = this.normalizePoints(resolved.x, resolved.y);
    this.ctx.moveTo(normalized.x, normalized.y);
  };

  BaseGameObject.prototype.setLayer = function (layer) {
    this.layer = layer;
  };

  BaseGameObject.prototype.setRenderedState = function (state) {
    this.rendered = state;
  };

  return BaseGameObject;
}();

exports.BaseGameObject = BaseGameObject;
},{"../lib/matrix":"lib/matrix.ts","./Transform":"objects/Transform.ts"}],"lib/shapes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.farDot = exports.square = exports.circle = void 0;
var _circleMemo = {};

function circle(segments) {
  if (!_circleMemo[segments]) {
    var segmentAngle = 2 * Math.PI / segments;
    var pts = [];

    for (var i = 0; i < segments; i++) {
      var angle = segmentAngle * i;
      pts.push({
        x: 0.5 * Math.cos(angle),
        y: 0.5 * Math.sin(angle)
      });
    }

    _circleMemo[segments] = pts;
  }

  return _circleMemo[segments]; //.slice()
}

exports.circle = circle;
var _squareMemo = {};

function square(segments) {
  if (!_squareMemo[segments]) {
    var pts = []; // draw points from top-right to bottom-right to bottom-left to top-left and back

    var segQtrNum = Math.floor(segments / 4);

    for (var i = 0; i < segments; i++) {
      switch (Math.floor(4 * i / segments)) {
        // from top-right to bottom-right
        case 0:
          pts.push({
            x: 0.5,
            y: -0.5 + i / segQtrNum
          });
          break;
        // from bottom-right to bottom-left

        case 1:
          pts.push({
            x: 0.5 - (i - segQtrNum) / segQtrNum,
            y: 0.5
          });
          break;
        // from bottom-left to top-left

        case 2:
          pts.push({
            x: -0.5,
            y: 0.5 - (i - 2 * segQtrNum) / segQtrNum
          });
          break;
        // from top-left to top-right

        case 3:
          pts.push({
            x: -0.5 + (i - 3 * segQtrNum) / segQtrNum,
            y: -0.5
          });
      }
    }

    _squareMemo[segments] = pts;
  }

  return _squareMemo[segments];
}

exports.square = square;
var DOT_SIZE = 0.005;

function farDot(center) {
  var diamondPts = circle(4);
  return diamondPts.map(function (pt) {
    return {
      x: DOT_SIZE * pt.x + center.x,
      y: DOT_SIZE * pt.y + center.y
    };
  });
}

exports.farDot = farDot;
},{}],"lib/utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = exports.debounce = exports.throttle = exports.calcAngle = exports.rotate = exports.calcMidpoints = exports.findPointBetweenPoints = void 0; // math utils

function findPointBetweenPoints(start, end, k) {
  var dx = end.x - start.x;
  var dy = end.y - start.y;
  return {
    x: start.x + dx * k,
    y: start.y + dy * k
  };
}

exports.findPointBetweenPoints = findPointBetweenPoints;

function calcMidpoints(points, loops) {
  var midpoints = [];

  for (var i = 0; i < points.length - 1; i++) {
    midpoints.push(findPointBetweenPoints(points[i], points[i + 1], 0.5));
  }

  if (loops) midpoints.push(findPointBetweenPoints(points[points.length - 1], points[0], 0.5));
  return midpoints;
}

exports.calcMidpoints = calcMidpoints;

function rotate(x, y, angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var newX = x * cos - y * sin;
  var newY = x * sin + y * cos;
  return {
    x: newX,
    y: newY
  };
}

exports.rotate = rotate;

function calcAngle(x, y) {
  var angle = Math.atan(y / x); // adjust angles in Quadrant III and IV

  if (x < 0) {
    angle += Math.PI;
  }

  return angle;
}

exports.calcAngle = calcAngle; // time utils

function throttle(fn, time) {
  var lastTime;
  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!lastTime || Date.now() > lastTime + time) {
      fn.apply(void 0, args);
      lastTime = Date.now();
    }
  };
}

exports.throttle = throttle;

function debounce(fn, wait) {
  var timeout = null;
  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      fn.apply(void 0, args);
      timeout = null;
    }, wait);
  };
}

exports.debounce = debounce; // time in terms of ms

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

exports.sleep = sleep;
},{}],"objects/Bullet.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bullet = void 0;

var BaseGameObject_1 = require("./BaseGameObject");

var CONSTS_1 = require("../CONSTS");

var shapes_1 = require("../lib/shapes");

var utils_1 = require("../lib/utils");

var Bullet =
/** @class */
function (_super) {
  __extends(Bullet, _super);

  function Bullet(props) {
    var _this = _super.call(this, props) || this;

    _this.speed = CONSTS_1.BULLET_SPEED;
    _this.color = CONSTS_1.COLORS.PLAYER;

    _this.initPoints();

    return _this;
  }

  Bullet.prototype.initPoints = function () {
    this.points = shapes_1.circle(4);
  };

  Bullet.prototype.update = function (timeDelta) {
    var z = this.transform.getTransformProps().z;
    var newZ = z + timeDelta * CONSTS_1.BULLET_SPEED;
    var newPoint = utils_1.findPointBetweenPoints(this.to, this.from, newZ);
    this.setTransformWithProps(__assign({
      z: newZ
    }, newPoint));
  };

  Bullet.prototype.render = function () {
    var _this = this;

    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.points.forEach(function (_a, i) {
      var x = _a.x,
          y = _a.y;
      i === 0 ? _this.localMoveTo(x, y) : _this.localLineTo(x, y);
    });
    this.ctx.closePath();
    this.ctx.fill();
  };

  return Bullet;
}(BaseGameObject_1.BaseGameObject);

exports.Bullet = Bullet;
},{"./BaseGameObject":"objects/BaseGameObject.ts","../CONSTS":"CONSTS.ts","../lib/shapes":"lib/shapes.ts","../lib/utils":"lib/utils.ts"}],"objects/Player.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var BaseGameObject_1 = require("./BaseGameObject");

var CONSTS_1 = require("../CONSTS");

var Bullet_1 = require("./Bullet");

var utils_1 = require("../lib/utils");

var Player =
/** @class */
function (_super) {
  __extends(Player, _super);

  function Player(props) {
    var _this = _super.call(this, props) || this;

    if (!_this.color) {
      _this.color = CONSTS_1.COLORS.PLAYER;
    }

    _this.keydown = _this.keydown.bind(_this);
    _this.keyup = _this.keyup.bind(_this);
    _this.enableFiring = _this.enableFiring.bind(_this);
    _this.disableFiring = _this.disableFiring.bind(_this);
    _this.fireBullet = utils_1.throttle(_this._fireBullet.bind(_this), 150);
    return _this;
  }

  Player.prototype._fireBullet = function () {
    var bulletTf = this.level.getBulletPath();
    var laneIdx = this.level.getPlayerSpotIdx();
    var bullet = new Bullet_1.Bullet(__assign(__assign(__assign({
      game: this.game,
      ctx: this.ctx,
      level: this.level,
      laneIdx: laneIdx,
      parent: this.parent
    }, bulletTf.to), bulletTf), {
      w: 0.05,
      h: 0.05
    }));
    this.level.addBullet(bullet, laneIdx);
    this.game.addObject(bullet, this.layer);
  };

  Player.prototype.keydown = function (e) {
    if (e.code === "Space") {
      this.enableFiring();
    }
  };

  Player.prototype.keyup = function (e) {
    if (e.code === "Space") {
      this.disableFiring();
    }
  };

  Player.prototype.enableFiring = function () {
    this.isFiring = true;
  };

  Player.prototype.disableFiring = function () {
    this.isFiring = false;
  };

  Player.prototype.setListeners = function () {
    window.addEventListener("keydown", this.keydown, true);
    window.addEventListener("keyup", this.keyup, true);
    this.ctx.canvas.addEventListener("mousedown", this.enableFiring, true);
    this.ctx.canvas.addEventListener("mouseup", this.disableFiring, true);
  };

  Player.prototype.removeListeners = function () {
    window.removeEventListener("keydown", this.keydown, true);
    window.removeEventListener("keyup", this.keyup, true);
    this.ctx.canvas.removeEventListener("mousedown", this.enableFiring, true);
    this.ctx.canvas.removeEventListener("mouseup", this.disableFiring, true);
  };

  Player.prototype.update = function () {
    if (this.isFiring) this.fireBullet();
  };

  Player.prototype.render = function () {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.localMoveTo(-0.25, -0.25);
    this.localLineTo(-0.5, 0);
    this.localLineTo(0, 0.3);
    this.localLineTo(0.5, 0);
    this.localLineTo(0.25, -0.25);
    this.localLineTo(0.4, 0);
    this.localLineTo(0, 0.1);
    this.localLineTo(-0.4, 0);
    this.ctx.closePath();
    this.ctx.stroke();
  };

  Player.prototype.setLevel = function (level) {
    this.level = level;
  };

  return Player;
}(BaseGameObject_1.BaseGameObject);

exports.Player = Player;
},{"./BaseGameObject":"objects/BaseGameObject.ts","../CONSTS":"CONSTS.ts","./Bullet":"objects/Bullet.ts","../lib/utils":"lib/utils.ts"}],"Game.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = exports.SceneType = void 0;

var Player_1 = require("./objects/Player");

var utils_1 = require("./lib/utils");

var CONSTS_1 = require("./CONSTS");

var LayerCollection =
/** @class */
function () {
  function LayerCollection() {
    this.layers = []; // id mapped to serialized string: "layerIdx, objIdxInLayer"

    this.objIdMap = {};
  }

  LayerCollection.prototype.addObject = function (obj, layerIdx) {
    var _a;

    if (layerIdx === void 0) {
      layerIdx = 0;
    } // object already added


    if (this.objIdMap[obj.id]) return;

    if (this.layers[layerIdx]) {
      this.layers[layerIdx][obj.id] = obj;
    } else {
      this.layers[layerIdx] = (_a = {}, _a[obj.id] = obj, _a);
    }

    this.objIdMap[obj.id] = layerIdx;
  };

  LayerCollection.prototype.removeObject = function (obj) {
    if (this.objIdMap[obj.id] !== undefined) {
      var layerIdx = this.objIdMap[obj.id];
      delete this.objIdMap[obj.id];
      delete this.layers[layerIdx][obj.id];
    }
  }; // apply function to all objects in layer collection, in order


  LayerCollection.prototype.applyFn = function (fn, filterFn) {
    for (var i = 0; i < this.layers.length; i++) {
      var layer = this.layers[i];
      Object.values(layer).forEach(function (obj) {
        if (!filterFn || filterFn(obj)) fn(obj);
      });
    }
  };

  return LayerCollection;
}(); // scene types


var SceneType;

(function (SceneType) {
  SceneType["LEVEL"] = "LEVEL";
  SceneType["TITLE"] = "TITLE";
  SceneType["WIN"] = "WIN";
  SceneType["GAME_OVER"] = "GAME_OVER";
})(SceneType = exports.SceneType || (exports.SceneType = {}));

var Game =
/** @class */
function () {
  function Game(_a) {
    var canvas = _a.canvas,
        ctx = _a.ctx,
        levels = _a.levels,
        _b = _a.state,
        state = _b === void 0 ? {
      /*
      sceneType: SceneType.TITLE
      */
      sceneType: SceneType.LEVEL,
      levelState: {
        idx: 0
      }
    } : _b;
    this.running = true;
    this.objId = -1;
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = state;
    this.levels = levels;
  }

  Game.prototype.start = function () {
    // create player
    this.player = new Player_1.Player(this.getDefaultProps()); // cache canvas rect

    this.canvasRect = this.canvas.getBoundingClientRect();
    this.startScene();
    this.setListeners();
    this.lastTime = Date.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  };

  Game.prototype.startScene = function () {
    // clear layers
    this.layerCollection = new LayerCollection();

    switch (this.state.sceneType) {
      case SceneType.LEVEL:
        this.startLevel();
        break;
    }
  };

  Game.prototype.startLevel = function () {
    var idx = this.state.levelState.idx;
    this.currLevel = new this.levels[idx](__assign(__assign({}, this.getDefaultProps()), {
      x: 0,
      y: 0,
      w: 0.65,
      h: 0.65
    }));
    this.addObject(this.currLevel, 0);
    this.currLevel.initPlayerSpots();
    this.currLevel.setPlayer(this.player);
    this.currLevel.startSpawning();
  };

  Game.prototype.addObject = function (obj, layer) {
    if (layer === void 0) {
      layer = 0;
    }

    if (obj.id === undefined) obj.id = this.getNewObjId();
    obj.setRenderedState(true);
    this.layerCollection.addObject(obj, layer);
    obj.initPoints();
    obj.setListeners();
    obj.setLayer(layer);

    for (var _i = 0, _a = obj.children; _i < _a.length; _i++) {
      var child = _a[_i];
      this.addObject(child, layer);
    }
  };

  Game.prototype.removeObject = function (obj) {
    this.layerCollection.removeObject(obj);
    obj.removeListeners();

    for (var _i = 0, _a = obj.children; _i < _a.length; _i++) {
      var child = _a[_i];
      this.removeObject(child);
    }
  }; // listeners


  Game.prototype.handleMouse = function (e) {
    if (!this.currLevel) return;
    this.currLevel.startUpdatingWithCursor(e.clientX - this.canvasRect.x, e.clientY - this.canvasRect.y);
  };

  Game.prototype.handleMouseLeave = function () {
    if (!this.currLevel) return;
    this.currLevel.stopUpdatingWithCursor();
  };

  Game.prototype.setListeners = function () {
    this.canvas.addEventListener("mouseenter", this.handleMouse.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouse.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    var resizeHandler = utils_1.debounce(function () {
      // recache canvas rect
      this.canvasRect = this.canvas.getBoundingClientRect();
    }, 200);
    window.addEventListener("resize", resizeHandler);
  };

  Game.prototype.gameLoop = function (time) {
    if (this.running) {
      // skip first cycle to initialize lastTime
      if (!this.lastTime) {
        this.lastTime = time;
      } else {
        var timeDelta = time - this.lastTime;
        this.lastTime = time;
        this.draw(timeDelta, time);
      }

      requestAnimationFrame(this.gameLoop.bind(this));
    }
  };

  Game.prototype.draw = function (timeDelta, time) {
    this.ctx.fillStyle = CONSTS_1.COLORS.BG;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerCollection.applyFn(function (obj) {
      obj._update(timeDelta, time);

      obj._render();
    });
  };

  Game.prototype.updateState = function (newState) {
    var updateScene = newState.sceneType !== this.state.sceneType;
    this.state = newState;

    if (updateScene) {
      this.startScene();
    }
  }; // util for getting default Game Object props


  Game.prototype.getDefaultProps = function () {
    return {
      game: this,
      ctx: this.ctx,
      id: this.getNewObjId()
    };
  };

  Game.prototype.getNewObjId = function () {
    if (this.objId < CONSTS_1.MAX_ID) {
      this.objId += 1;
    } else {
      this.objId = 0;
    }

    return this.objId;
  };

  return Game;
}();

exports.Game = Game;
},{"./objects/Player":"objects/Player.ts","./lib/utils":"lib/utils.ts","./CONSTS":"CONSTS.ts"}],"lib/Queue.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Queue = void 0;

var Queue =
/** @class */
function () {
  function Queue(initItems) {
    this.first = null;
    this.last = null;

    if (initItems) {
      this.enqueue(initItems);
    }
  }

  Queue.prototype.enqueue = function (item) {
    var _this = this;

    if (!Array.isArray(item)) item = [item];
    item.forEach(function (_item) {
      var newNode = new QueueNode(_item);

      if (!_this.first) {
        _this.first = _this.last = newNode;
      } else {
        _this.last.next = newNode;
        _this.last = newNode;
      }
    });
  };

  Queue.prototype.dequeue = function () {
    var dequeued = this.first;

    if (this.first === this.last) {
      this.first = this.last = null;
    } else {
      this.first = this.first.next;
    }

    return dequeued.item;
  };

  Queue.prototype.getFirst = function () {
    return this.first && this.first.item;
  };

  return Queue;
}();

exports.Queue = Queue;

var QueueNode =
/** @class */
function () {
  function QueueNode(item) {
    this.item = item;
  }

  return QueueNode;
}();
},{}],"objects/Enemy.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enemy = void 0;

var BaseGameObject_1 = require("./BaseGameObject");

var CONSTS_1 = require("../CONSTS");

var shapes_1 = require("../lib/shapes");

var Enemy =
/** @class */
function (_super) {
  __extends(Enemy, _super);

  function Enemy(props) {
    return _super.call(this, props) || this;
  }

  Enemy.prototype.updatePath = function (to, from) {
    this.to = to;
    this.from = from;
  };

  Enemy.prototype.setLevel = function (level) {
    this.level = level;
  };

  Enemy.prototype.calcFarPoint = function () {
    // range from 0.2 to 0.8
    var distAwayFromLine = 0.8 - 0.6 * Math.min(1, this.transform.z - 1);
    return {
      x: CONSTS_1.LEVEL_CENTER.x + (this.to.x - CONSTS_1.LEVEL_CENTER.x) * distAwayFromLine,
      y: CONSTS_1.LEVEL_CENTER.y + (this.to.y - CONSTS_1.LEVEL_CENTER.y) * distAwayFromLine
    };
  };

  Enemy.prototype.render = function () {
    var _this = this;

    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath(); // render far shape

    if (this.transform.z > 1) {
      var farPoints = shapes_1.farDot(this.calcFarPoint());
      farPoints.forEach(function (_a, i) {
        var x = _a.x,
            y = _a.y;
        i === 0 ? _this.level.localMoveTo(x, y) : _this.level.localLineTo(x, y);
      });
    } else {
      this.points.forEach(function (_a, i) {
        var x = _a.x,
            y = _a.y;
        i === 0 ? _this.localMoveTo(x, y) : _this.localLineTo(x, y);
      });
    }

    this.ctx.closePath();
    this.ctx.stroke();
  };

  return Enemy;
}(BaseGameObject_1.BaseGameObject);

exports.Enemy = Enemy;
},{"./BaseGameObject":"objects/BaseGameObject.ts","../CONSTS":"CONSTS.ts","../lib/shapes":"lib/shapes.ts"}],"objects/RedEnemy.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedEnemy = void 0;

var CONSTS_1 = require("../CONSTS");

var Enemy_1 = require("./Enemy");

var utils_1 = require("../lib/utils");

var RedEnemy =
/** @class */
function (_super) {
  __extends(RedEnemy, _super);

  function RedEnemy(props) {
    var _this = _super.call(this, props) || this;

    _this.color = CONSTS_1.COLORS.RED;
    _this.speed = CONSTS_1.RED_ENEMY_SPEED;
    return _this;
  }

  RedEnemy.prototype.initPoints = function () {
    this.points = [// left edge
    {
      x: -0.5,
      y: -0.25
    }, {
      x: -0.25,
      y: 0
    }, {
      x: -0.5,
      y: 0.25
    }, // right edge
    {
      x: 0.5,
      y: -0.25
    }, {
      x: 0.25,
      y: 0
    }, {
      x: 0.5,
      y: 0.25
    }];
  };

  RedEnemy.prototype.update = function (timeDelta) {
    var z = this.transform.getTransformProps().z; // console.log("tf z", this.transform.z);
    // console.log("z", z);

    var newZ = z - timeDelta * this.speed;

    if (newZ < 0) {
      this.destroy();
      return;
    }

    var newPoint = utils_1.findPointBetweenPoints(this.from, this.to, newZ);
    this.setTransformWithProps(__assign({
      z: newZ
    }, newPoint));
  };

  return RedEnemy;
}(Enemy_1.Enemy);

exports.RedEnemy = RedEnemy;
},{"../CONSTS":"CONSTS.ts","./Enemy":"objects/Enemy.ts","../lib/utils":"lib/utils.ts"}],"objects/EnemySpawner.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnemySpawner = void 0;

var BaseGameObject_1 = require("./BaseGameObject");

var RedEnemy_1 = require("./RedEnemy");

var EnemySpawner =
/** @class */
function (_super) {
  __extends(EnemySpawner, _super);

  function EnemySpawner(props) {
    var _this = _super.call(this, props) || this; // z that nearest enemy will start with


    _this.startingZ = 1.1; // z distance subsequent enemies start at

    _this.zIncrement = 0.1;
    var startingZ = props.startingZ,
        zIncrement = props.zIncrement;
    if (startingZ) _this.startingZ = startingZ;
    if (zIncrement) _this.zIncrement = zIncrement;
    return _this;
  }

  EnemySpawner.prototype.spawnEnemies = function () {
    var _this = this;

    this.enemyClasses.forEach(function (enemyClass, i) {
      var size = EnemySpawner.enemySizeMap.get(enemyClass);
      var newEnemy = new enemyClass(__assign(__assign({}, _this.game.getDefaultProps()), {
        w: size,
        h: size,
        z: _this.startingZ + _this.zIncrement * i
      }));

      _this.level.addEnemy(newEnemy);
    });
  };

  EnemySpawner.enemySizeMap = new Map([[RedEnemy_1.RedEnemy, 0.65]]);
  return EnemySpawner;
}(BaseGameObject_1.BaseGameObject);

exports.EnemySpawner = EnemySpawner;
},{"./BaseGameObject":"objects/BaseGameObject.ts","./RedEnemy":"objects/RedEnemy.ts"}],"objects/Level.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Level = void 0;

var BaseGameObject_1 = require("./BaseGameObject");

var utils_1 = require("../lib/utils");

var CONSTS_1 = require("../CONSTS");

var Queue_1 = require("../lib/Queue");

var EnemySpawner_1 = require("./EnemySpawner");

var Level =
/** @class */
function (_super) {
  __extends(Level, _super);

  function Level(props) {
    var _this = _super.call(this, props) || this;

    _this.playerSpots = [];
    _this.bulletSpots = [];
    _this.enemyClasses = [];
    _this.enemyStateMap = {}; // maps lane indices to enemies in lane

    _this.enemyLaneMap = {}; // maps lane indices to bullets in lane

    _this.bulletLaneMap = {};
    _this.playerSpotIdx = 0;
    _this.targetSpotIdx = 0;
    _this.updatingSpot = false;
    _this.loops = true; // Level-specific points

    _this.farPoints = [];
    _this.midpoints = [];
    _this.farMidpoints = [];
    var loops = props.loops;
    if (loops !== undefined) _this.loops = loops;
    _this.throttledUpdateSpot = utils_1.throttle(_this.updatePlayerSpot.bind(_this), 50);
    return _this;
  }

  Level.prototype.startSpawning = function () {
    this.enemySpawner = new EnemySpawner_1.EnemySpawner(__assign(__assign({}, this.game.getDefaultProps()), {
      level: this,
      enemyClasses: this.enemyClasses
    }));
    this.enemySpawner.spawnEnemies();
  };

  Level.prototype.setPlayer = function (player) {
    this.player = player;
    player.updateTransformWithProps(this.playerSpots[this.playerSpotIdx]);
    this.player.setLevel(this);
    this.addChildren(player);
  };

  Level.prototype.addEnemy = function (enemy) {
    if (this.enemyStateMap[enemy.id]) return;
    var spotIdx = Math.floor(this.farMidpoints.length * Math.random()); // store references to enemy

    this.enemyStateMap[enemy.id] = {
      enemy: enemy,
      spotIdx: spotIdx
    };

    if (this.enemyLaneMap[spotIdx]) {
      this.enemyLaneMap[spotIdx].enqueue(enemy);
    } else {
      this.enemyLaneMap[spotIdx] = new Queue_1.Queue(enemy);
    }

    this.addChildren(enemy);
    var fromPoint = this.farMidpoints[spotIdx];
    var toPoint = this.midpoints[spotIdx];
    enemy.setTransformWithProps(__assign(__assign({}, fromPoint), {
      w: CONSTS_1.ENEMY_TO_LEVEL_SIZE,
      h: CONSTS_1.ENEMY_TO_LEVEL_SIZE,
      angle: Math.PI / 2 - utils_1.calcAngle(toPoint.x, toPoint.y)
    }));
    enemy.updatePath(fromPoint, this.midpoints[spotIdx]);
    enemy.setLevel(this);
  }; // clear enemy references


  Level.prototype.removeEnemy = function (enemy) {
    var spotIdx = this.enemyStateMap[enemy.id].spotIdx;
    delete this.enemyLaneMap[spotIdx][enemy.id];
    delete this.enemyStateMap[enemy.id];
    enemy.destroy();
  };

  Level.prototype.addBullet = function (bullet, laneIdx) {
    if (this.bulletLaneMap[laneIdx]) {
      this.bulletLaneMap[laneIdx].enqueue(bullet);
    } else {
      this.bulletLaneMap[laneIdx] = new Queue_1.Queue(bullet);
    }
  }; // TODO:


  Level.prototype.moveEnemy = function (enemy, spotDiff) {}; // to be overwritten by Level classes


  Level.prototype.getLevelPoints = function () {
    return [];
  }; // sets points


  Level.prototype.initPoints = function () {
    this.points = this.getLevelPoints();
    this.farPoints = this.points.map(function (_a) {
      var x = _a.x,
          y = _a.y;
      var bx = CONSTS_1.LEVEL_CENTER.x,
          by = CONSTS_1.LEVEL_CENTER.y;
      return {
        x: bx + x * CONSTS_1.FAR_SCALE,
        y: by + y * CONSTS_1.FAR_SCALE
      };
    }); // also calculate midpoints

    this.midpoints = utils_1.calcMidpoints(this.points, this.loops);
    this.farMidpoints = utils_1.calcMidpoints(this.farPoints, this.loops);
  }; // sets player spots based on points


  Level.prototype.initPlayerSpots = function () {
    this.playerSpots = [];
  }; // get bullet path at player's position


  Level.prototype.getBulletPath = function () {
    return {
      to: this.midpoints[this.playerSpotIdx],
      from: this.farMidpoints[this.playerSpotIdx]
    };
  };

  Level.prototype.getPlayerSpotIdx = function () {
    return this.playerSpotIdx;
  };

  Level.prototype._render = function () {
    this.renderLevelPoints(this.points);
    this.renderLevelPoints(this.farPoints); // render lines b/w near and far points

    for (var i = 0; i < this.points.length; i++) {
      var nearPt = this.points[i];
      var farPt = this.farPoints[i];
      var highlight = this.playerSpotIdx === i || this.playerSpotIdx + 1 === i || // handle loop
      this.loops && this.playerSpotIdx === this.points.length - 1 && i === 0;
      var color = highlight ? CONSTS_1.COLORS.PLAYER : CONSTS_1.COLORS.LINE;
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.localMoveTo(nearPt.x, nearPt.y);
      this.localLineTo(farPt.x, farPt.y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  };

  Level.prototype.renderLevelPoints = function (points) {
    var _this = this;

    this.ctx.beginPath();
    this.ctx.strokeStyle = CONSTS_1.COLORS.LINE;
    points.forEach(function (_a, i) {
      var x = _a.x,
          y = _a.y;
      i === 0 ? _this.localMoveTo(x, y) : _this.localLineTo(x, y);
    });
    this.loops && this.ctx.closePath();
    this.ctx.stroke();
  };

  Level.prototype.update = function () {
    this.throttledUpdateSpot(); // check for collisions

    this.checkCollisions(); // check for any bullets that need to be destroyed

    this.cleanBullets();
  };

  Level.prototype.checkCollisions = function () {
    var _this = this;

    Object.keys(this.enemyLaneMap).forEach(function (laneIdx) {
      var enemyLaneQueue = _this.enemyLaneMap[laneIdx];
      var bulletLaneQueue = _this.bulletLaneMap[laneIdx];
      if (!bulletLaneQueue) return;
      var firstEnemy = enemyLaneQueue.getFirst();
      var firstBullet = bulletLaneQueue.getFirst();
      var collides = firstEnemy && firstBullet && firstBullet.transform.z < 1 && firstBullet.transform.z + CONSTS_1.BULLET_TOLERANCE >= firstEnemy.transform.z;

      if (collides) {
        bulletLaneQueue.dequeue();
        enemyLaneQueue.dequeue();

        _this.removeEnemy(firstEnemy);

        firstBullet.destroy();
      }
    });
  };

  Level.prototype.cleanBullets = function () {
    var _this = this;

    Object.keys(this.bulletLaneMap).forEach(function (laneIdx) {
      var q = _this.bulletLaneMap[laneIdx];

      while (q.getFirst() && q.getFirst().transform.z + CONSTS_1.BULLET_TOLERANCE > 1) {
        var bullet = q.dequeue();
        bullet.destroy();
      }
    });
  }; // updates player position based on its spot index


  Level.prototype.updatePlayerSpot = function () {
    if (!this.updatingSpot || !this.player || this.playerSpotIdx === this.targetSpotIdx || // don't update if doesn't loop and have hit ends
    !this.loops && (this.targetSpotIdx < 0 || this.targetSpotIdx >= this.playerSpots.length)) return; // look for fastest path if loops

    var forwardTarget = this.targetSpotIdx < this.playerSpotIdx ? this.playerSpots.length + this.targetSpotIdx : this.targetSpotIdx;
    var forwardPath = forwardTarget - this.playerSpotIdx;
    var backwardTarget = this.targetSpotIdx > this.playerSpotIdx ? this.targetSpotIdx - this.playerSpots.length : this.targetSpotIdx;
    var backwardPath = backwardTarget - this.playerSpotIdx; // increment by 1 space in best direction

    if (Math.abs(forwardPath) < Math.abs(backwardPath)) {
      this.playerSpotIdx += 1;
      if (this.playerSpotIdx >= this.playerSpots.length) this.playerSpotIdx = 0;
    } else {
      this.playerSpotIdx -= 1;
      if (this.playerSpotIdx < 0) this.playerSpotIdx = this.playerSpots.length - 1;
    }

    this.player.setTransformWithProps(this.playerSpots[this.playerSpotIdx]);
  };

  Level.prototype.startUpdatingWithCursor = function (x, y) {
    this.updatingSpot = true;
  };

  Level.prototype.stopUpdatingWithCursor = function () {
    this.updatingSpot = false;
  };

  return Level;
}(BaseGameObject_1.BaseGameObject);

exports.Level = Level;
},{"./BaseGameObject":"objects/BaseGameObject.ts","../lib/utils":"lib/utils.ts","../CONSTS":"CONSTS.ts","../lib/Queue":"lib/Queue.ts","./EnemySpawner":"objects/EnemySpawner.ts"}],"objects/Circle.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = void 0;

var CONSTS_1 = require("../CONSTS");

var Level_1 = require("./Level");

var RedEnemy_1 = require("./RedEnemy");

var shapes_1 = require("../lib/shapes");

var utils_1 = require("../lib/utils");

var Circle =
/** @class */
function (_super) {
  __extends(Circle, _super);

  function Circle(props) {
    var _this = _super.call(this, props) || this;

    _this.rotationSpeed = Math.PI / 2000; // per ms

    _this.segments = 16;
    _this.enemyClasses = new Array(10).fill(RedEnemy_1.RedEnemy);
    return _this;
  }

  Circle.prototype.getLevelPoints = function () {
    return shapes_1.circle(this.segments);
  };

  Circle.prototype.initPlayerSpots = function () {
    var pts = this.points;
    var spots = [];

    for (var i = 0; i < pts.length; i++) {
      var j = i === pts.length - 1 ? 0 : i + 1;
      var p_i = pts[i];
      var p_j = pts[j]; // average b/w two points

      var avg_x = (p_i.x + p_j.x) / 2;
      var avg_y = (p_i.y + p_j.y) / 2;
      var segAngle = 2 * Math.PI / this.segments;
      var normalAngle = segAngle * (0.5 + i);
      var angle = Math.PI / 2 - normalAngle;
      var x = avg_x + CONSTS_1.PLAYER_TO_LEVEL_DIST * Math.cos(normalAngle);
      var y = avg_y + CONSTS_1.PLAYER_TO_LEVEL_DIST * Math.sin(normalAngle);
      spots.push({
        x: x,
        y: y,
        w: CONSTS_1.PLAYER_TO_LEVEL_SIZE,
        h: CONSTS_1.PLAYER_TO_LEVEL_SIZE,
        angle: angle
      });
    }

    this.playerSpots = spots;
  };

  Circle.prototype.startUpdatingWithCursor = function (x, y) {
    this.updatingSpot = true;
    var normX = x / this.ctx.canvas.width - 0.5;
    var normY = y / this.ctx.canvas.height - 0.5;
    var angle = utils_1.calcAngle(normX, normY);
    var segmentAngle = 2 * Math.PI / this.segments;
    var idx = Math.floor(angle / segmentAngle);
    if (idx < 0) idx += this.segments;
    this.targetSpotIdx = idx;
  };

  Circle.pointsMemo = {};
  return Circle;
}(Level_1.Level);

exports.Circle = Circle;
},{"../CONSTS":"CONSTS.ts","./Level":"objects/Level.ts","./RedEnemy":"objects/RedEnemy.ts","../lib/shapes":"lib/shapes.ts","../lib/utils":"lib/utils.ts"}],"objects/Square.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Square = void 0;

var CONSTS_1 = require("../CONSTS");

var Level_1 = require("./Level");

var RedEnemy_1 = require("./RedEnemy");

var shapes_1 = require("../lib/shapes");

var utils_1 = require("../lib/utils");

var Square =
/** @class */
function (_super) {
  __extends(Square, _super);

  function Square(props) {
    var _this = _super.call(this, props) || this;

    _this.segments = 16;
    _this.enemyClasses = new Array(20).fill(RedEnemy_1.RedEnemy);
    return _this;
  }

  Square.prototype.getLevelPoints = function () {
    return shapes_1.square(this.segments);
  };

  Square.prototype.initPlayerSpots = function () {
    var pts = this.points;
    var spots = [];

    for (var i = 0; i < pts.length; i++) {
      var j = i === pts.length - 1 ? 0 : i + 1;
      var p_i = pts[i];
      var p_j = pts[j]; // average b/w two points

      var x = (p_i.x + p_j.x) / 2;
      var y = (p_i.y + p_j.y) / 2;
      var angle = void 0; // choose angle based on side

      switch (Math.floor(4 * i / this.segments)) {
        // from top-right to bottom-right
        case 0:
          x += CONSTS_1.PLAYER_TO_LEVEL_DIST;
          angle = Math.PI / 2;
          break;
        // from bottom-right to bottom-left

        case 1:
          y += CONSTS_1.PLAYER_TO_LEVEL_DIST;
          angle = 0;
          break;
        // from bottom-left to top-left

        case 2:
          x -= CONSTS_1.PLAYER_TO_LEVEL_DIST;
          angle = -Math.PI / 2;
          break;
        // from top-left to top-right

        case 3:
          y -= CONSTS_1.PLAYER_TO_LEVEL_DIST;
          angle = Math.PI;
      }

      spots.push({
        x: x,
        y: y,
        w: CONSTS_1.PLAYER_TO_LEVEL_SIZE,
        h: CONSTS_1.PLAYER_TO_LEVEL_SIZE,
        angle: angle
      });
    }

    this.playerSpots = spots;
  };

  Square.prototype.startUpdatingWithCursor = function (x, y) {
    this.updatingSpot = true;
    var normX = x / this.ctx.canvas.width - 0.5;
    var normY = y / this.ctx.canvas.height - 0.5; // since spots start at top-right, shift angle by 45 deg CCW

    var angle = utils_1.calcAngle(normX, normY) + Math.PI / 4;
    var segmentAngle = 2 * Math.PI / this.segments;
    var idx = Math.floor(angle / segmentAngle);
    if (idx < 0) idx += this.segments;
    this.targetSpotIdx = idx;
  };

  Square.pointsMemo = {};
  return Square;
}(Level_1.Level);

exports.Square = Square;
},{"../CONSTS":"CONSTS.ts","./Level":"objects/Level.ts","./RedEnemy":"objects/RedEnemy.ts","../lib/shapes":"lib/shapes.ts","../lib/utils":"lib/utils.ts"}],"main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Game_1 = require("./Game");

var Circle_1 = require("./objects/Circle");

var Square_1 = require("./objects/Square");

var game, canvas, ctx;

function main() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  game = new Game_1.Game({
    canvas: canvas,
    ctx: ctx,
    levels: [Circle_1.Circle, Square_1.Square]
  });
  game.start();
}

main();
},{"./Game":"Game.ts","./objects/Circle":"objects/Circle.ts","./objects/Square":"objects/Square.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56077" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map