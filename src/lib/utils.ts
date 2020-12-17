import { BaseGameObject } from "../objects/BaseGameObject";
import { TransformPropsInterface, Point, VoidFunction } from "../types";

// math utils
export function findPointBetweenPoints(
  start: Point,
  end: Point,
  k: number
): Point {
  return {
    x: findValueBetweenValues(start.x, end.x, k),
    y: findValueBetweenValues(start.y, end.y, k),
  };
}

export function findValueBetweenValues(start: number, end: number, k: number) {
  return start + k * (end - start);
}

export function getPercentBetweenValues(
  start: number,
  end: number,
  target: number
) {
  return (target - start) / (end - start);
}

export function calcMidpoints(points: Point[], loops: boolean): Point[] {
  const midpoints = [];
  for (let i = 0; i < points.length - 1; i++) {
    midpoints.push(findPointBetweenPoints(points[i], points[i + 1], 0.5));
  }

  if (loops)
    midpoints.push(
      findPointBetweenPoints(points[points.length - 1], points[0], 0.5)
    );

  return midpoints;
}

// true - move forward to get to target
// false - move backward to get to target
export function shouldMoveForwardInLoop(
  currIdx: number,
  targetIdx: number,
  iterLen: number
): boolean {
  const forwardTarget = targetIdx < currIdx ? iterLen + targetIdx : targetIdx;
  const forwardPath = forwardTarget - currIdx;

  const backwardTarget = targetIdx > currIdx ? targetIdx - iterLen : targetIdx;
  const backwardPath = backwardTarget - currIdx;

  return Math.abs(forwardPath) < Math.abs(backwardPath);
}

export function rotate(x, y, angle): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  let newX = x * cos - y * sin;
  let newY = x * sin + y * cos;

  return {
    x: newX,
    y: newY,
  };
}

export function calcAngle(x, y): number {
  let angle = Math.atan(y / x);
  // adjust angles in Quadrant III and IV
  if (x < 0) {
    angle += Math.PI;
  }
  return angle;
}

// time utils
export function throttle(fn: VoidFunction, time: number): VoidFunction {
  let lastTime: number;
  return function (...args) {
    if (!lastTime || Date.now() > lastTime + time) {
      fn(...args);
      lastTime = Date.now();
    }
  };
}

export function debounce(fn: VoidFunction, wait: number): VoidFunction {
  let timeout = null;
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      fn(...args);
      timeout = null;
    }, wait);
  };
}

// time in terms of ms
export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// rendering util
export function renderPoints(
  obj: BaseGameObject,
  {
    xOffset = 0,
    yOffset = 0,
    scale = 1,
    color,
  }: {
    xOffset?: number;
    yOffset?: number;
    scale?: number;
    color?: string;
  } = {}
) {
  if (obj.useStrokes) {
    obj.ctx.strokeStyle = color || obj.color;
  } else {
    obj.ctx.fillStyle = color || obj.color;
  }
  obj.ctx.beginPath();
  obj.points.forEach((p, i) => {
    i === 0
      ? obj.localMoveTo(scale * p.x + xOffset, scale * p.y + yOffset)
      : obj.localLineTo(scale * p.x + xOffset, scale * p.y + yOffset);
  });
  obj.ctx.closePath();
  if (obj.useStrokes) {
    obj.ctx.stroke();
  } else {
    obj.ctx.fill();
  }
}
