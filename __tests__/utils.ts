import { rotate } from "../src/lib/utils";

const TOLERANCE = 0.0001;

describe("rotate", () => {
  it("should rotate a 2D vector with given angle (radians, positive is CCW)", () => {
    const rotated = rotate(1, 0, Math.PI / 2);
    const isCorrectX = Math.abs(rotated.x - 0) < TOLERANCE;
    const isCorrectY = Math.abs(rotated.y - 1) < TOLERANCE;
    expect(isCorrectX).toBe(true);
    expect(isCorrectY).toBe(true);
  });
});
