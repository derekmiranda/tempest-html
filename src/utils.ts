import { TransformPropsInterface, Point } from "./types";

// get x,y,w,h using anchor relative to width and height (in terms of 0-1)
export function getDimsWithAnchor({
  x,
  y,
  w,
  h,
  xAnchor,
  yAnchor,
}: {
  x: number;
  y: number;
  xAnchor: number;
  yAnchor: number;
  w: number;
  h: number;
}): TransformPropsInterface {
  return {
    x: x - (1 - xAnchor) * w,
    y: y - (1 - yAnchor) * h,
    w,
    h,
  };
}

// centered dims util
export function centerDims({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}): TransformPropsInterface {
  return getDimsWithAnchor({ x, y, w, h, xAnchor: 0.5, yAnchor: 0.5 });
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

export function throttle(fn: Function, time: number): Function {
  let lastTime: number;
  return function () {
    if (!lastTime || Date.now() + time > lastTime) {
      fn();
      lastTime = Date.now();
    }
  };
}
