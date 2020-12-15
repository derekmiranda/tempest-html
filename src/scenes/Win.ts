import { Game } from "../Game";
import { TextObject } from "../objects/TextObject";
import { Scene } from "../types";

export const Win: Scene = (game: Game) => {
  game.addObject(
    new TextObject({
      ...game.getDefaultProps(),
      text: "YOU WIN!!",
      y: -0.15,
      h: 0.12,
    })
  );
  game.addObject(
    new TextObject({
      ...game.getDefaultProps(),
      text: (game.state.score + "").padStart(6, "0"),
      y: 0.1,
      h: 0.12,
      blinking: true,
    })
  );
  game.addObject(
    new TextObject({
      ...game.getDefaultProps(),
      text: "CLICK TO RETURN TO TITLE",
      y: 0.3,
      h: 0.04,
    })
  );
};
