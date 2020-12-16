import { Game } from "../Game";
import { TextObject } from "../objects/TextObject";
import { TitleAnimation } from "../objects/TitleAnimation";
import { Scene } from "../types";

export const Title: Scene = (game: Game) => {
  const titleAnim = new TitleAnimation({
    ...game.getDefaultProps(),
    text: "WILLIWAW",
    farTransformProps: {
      x: 0,
      y: 0,
      h: 0.01,
    },
    nearTransformProps: {
      x: 0,
      y: -0.15,
      h: 0.15,
    },
  });
  game.addObject(titleAnim);
  game.addObject(
    new TextObject({
      ...game.getDefaultProps(),
      text: "CLICK TO CONTINUE",
      y: 0.2,
      h: 0.06,
      blinking: true,
    })
  );
};
