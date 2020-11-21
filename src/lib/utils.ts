import { TransformPropsInterface, Point } from "../types";

// math utils
export function findPointBetweenPoints(
  start: Point,
  end: Point,
  k: number
): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: start.x + dx * k,
    y: start.y + dy * k,
  };
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

// time utils
export function throttle(fn: Function, time: number): Function {
  let lastTime: number;
  return function (...args) {
    if (!lastTime || Date.now() > lastTime + time) {
      fn(...args);
      lastTime = Date.now();
    }
  };
}

export function debounce(fn: Function, wait: number): Function {
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
