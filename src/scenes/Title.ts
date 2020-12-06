import { Game } from "../Game";
import { Explosion } from "../objects/Explosion";
import { Scene } from "../types";

export const Title: Scene = (game: Game) => {
  const explosion = new Explosion(game.getDefaultProps());
  game.addObject(explosion);
  return () => {};
};
