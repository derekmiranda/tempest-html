import { COLORS } from "../CONSTS";
import { Game } from "../Game";
import { TextObject } from "../objects/TextObject";
import { Scene } from "../types";

export const Title: Scene = (game: Game) => {
  game.addObject(
    new TextObject({
      ...game.getDefaultProps(),
      text: "WILLIWAW",
      y: -0.1,
      h: 0.12,
    })
  );
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
