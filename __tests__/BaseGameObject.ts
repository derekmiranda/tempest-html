import { BaseGameObject } from "../src/objects/BaseGameObject";

describe("BaseGameObject", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const defaultTfProps = {
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    angle: 0,
  };

  describe("default", () => {
    const obj = new BaseGameObject({
      ctx,
    });
    test("object starts with default transform", () => {
      expect(obj.transform.getTransformProps()).toStrictEqual(defaultTfProps);
    });
    test("object starts with default global transform", () => {
      expect(obj.globalTransform.getTransformProps()).toStrictEqual(
        defaultTfProps
      );
    });
  });

  describe("parent and child rotation", () => {
    const parent = new BaseGameObject({
      ctx,
      angle: Math.PI / 2,
    });
    const child = new BaseGameObject({
      ctx,
      parent,
      angle: Math.PI / 2,
    });

    const piProps = {
      ...defaultTfProps,
      angle: Math.PI,
    };

    const halfPiProps = {
      ...defaultTfProps,
      angle: Math.PI / 2,
    };

    test("parent has correct transforms based on props", () => {
      expect(parent.transform.getTransformProps()).toStrictEqual(halfPiProps);
      expect(parent.globalTransform.getTransformProps()).toStrictEqual(
        halfPiProps
      );
    });

    test("child has correct relative transform", () => {
      expect(child.transform.getTransformProps()).toStrictEqual(halfPiProps);
    });

    test("child has correct global transform, based on parent angle", () => {
      expect(child.globalTransform.getTransformProps()).toStrictEqual(piProps);
    });
  });

  describe.skip("parent and child translation", () => {});
  describe.skip("parent and child rotation", () => {});
});
