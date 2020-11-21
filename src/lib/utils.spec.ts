import { rotate, findPointBetweenPoints } from "./utils";
import { Point } from "../types";

const TOLERANCE = 0.0001;

describe("findPointBetweenPoints", () => {
  const start = { x: 5, y: 8 };
  const end = { x: -4, y: 12 };

  it("should return start point with k = 0", () => {
    expect(findPointBetweenPoints(start, end, 0)).toStrictEqual(start);
  });

  it("should return end point with k = 1", () => {
    expect(findPointBetweenPoints(start, end, 1)).toStrictEqual(end);
  });

  it("can return points with k > 1", () => {
    expect(findPointBetweenPoints(start, end, 2)).toStrictEqual({
      x: -13,
      y: 16,
    });
  });

  it("can return points with k < 0", () => {
    expect(findPointBetweenPoints(start, end, -1)).toStrictEqual({
      x: 14,
      y: 4,
    });
  });

  it("returns point midway (0 < k < 1)", () => {
    const k = 0.3;
    const midpoint: Point = {
      x: start.x + k * (end.x - start.x),
      y: start.y + k * (end.y - start.y),
    };
    expect(findPointBetweenPoints(start, end, k)).toStrictEqual(midpoint);
  });
});

describe("rotate", () => {
  it("should rotate a 2D vector with given angle (radians, positive is CCW)", () => {
    const rotated = rotate(1, 0, Math.PI / 2);
    const isCorrectX = Math.abs(rotated.x - 0) < TOLERANCE;
    const isCorrectY = Math.abs(rotated.y - 1) < TOLERANCE;
    expect(isCorrectX).toBe(true);
    expect(isCorrectY).toBe(true);
  });
});
