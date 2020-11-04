import { DimsInterface } from "./types";

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
}): DimsInterface {
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
}): DimsInterface {
  return getDimsWithAnchor({ x, y, w, h, xAnchor: 0.5, yAnchor: 0.5 });
}
