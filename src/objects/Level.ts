import {
  GameObjectInterface,
  GameObjectPropsInterface,
  TransformPropsInterface,
} from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Player } from "./Player";

export interface LevelPlayerSpot extends TransformPropsInterface {}

export interface LevelPropsInterface extends GameObjectPropsInterface {
  loops?: boolean;
}

export class Level extends BaseGameObject {
  playerSpots: LevelPlayerSpot[] = [];
  player: Player;
  playerSpotIdx: number = 0;
  loops: boolean = true;

  constructor(props: LevelPropsInterface) {
    super(props);
    const { loops } = props;
    if (loops !== undefined) this.loops = loops;
  }

  setSpots(spots: LevelPlayerSpot[]) {
    this.playerSpots = spots;
  }

  setPlayer(player: Player) {
    this.player = player;
    player.updateTransformWithProps(this.playerSpots[this.playerSpotIdx]);
    this.addChildren(player);
  }

  updatePlayerSpot(spotDiff: number) {
    const newIdx = this.playerSpotIdx + spotDiff;

    // don't update if doesn't loop and have hit ends
    if (!this.loops && (newIdx < 0 || newIdx >= this.playerSpots.length))
      return;

    if (newIdx < 0) this.playerSpotIdx = this.playerSpots.length - 1;
    else if (newIdx >= this.playerSpots.length) this.playerSpotIdx = 0;
    else this.playerSpotIdx = newIdx;

    this.player.setTransformWithProps(this.playerSpots[this.playerSpotIdx]);
  }
}
