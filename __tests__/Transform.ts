import { Transform } from "../src/objects/Transform";

describe("Transform", () => {
  const tf = new Transform();

  it("starts with correct defaults", () => {
    expect(tf.getTransformProps()).toStrictEqual({
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      angle: 0,
    });
  });
});
