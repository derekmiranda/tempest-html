import { Game } from "../Game";
import { TextObject } from "../objects/TextObject";
import { Scene } from "../types";

export const GameEnd: (boolean) => Scene = (isWin: boolean) => (game: Game) => {
  game.addObject(
    new TextObject({
      ...game.getDefaultProps(),
      text: isWin ? "YOU WIN!!" : "GAME OVER",
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
