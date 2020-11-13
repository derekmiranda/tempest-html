import { GameObjectPropsInterface, TransformPropsInterface } from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Player } from "./Player";
import { throttle } from "../utils";

export interface LevelPlayerSpot extends TransformPropsInterface {}

export interface LevelPropsInterface extends GameObjectPropsInterface {
  loops?: boolean;
}

export class Level extends BaseGameObject {
  playerSpots: LevelPlayerSpot[] = [];
  player: Player;
  playerSpotIdx: number = 0;
  targetSpotIdx: number = 0;
  updatingSpot: boolean = false;
  loops: boolean = true;
  throttledUpdateSpot: Function;

  constructor(props: LevelPropsInterface) {
    super(props);
    const { loops } = props;
    if (loops !== undefined) this.loops = loops;
    this.throttledUpdateSpot = throttle(this.updatePlayerSpot.bind(this), 50);
  }

  setSpots(spots: LevelPlayerSpot[]) {
    this.playerSpots = spots;
  }

  setPlayer(player: Player) {
    this.player = player;
    player.updateTransformWithProps(this.playerSpots[this.playerSpotIdx]);
    this.addChildren(player);
  }

  // overwrite BaseGameObject _update method
  _update(timeDelta: number) {
    this.throttledUpdateSpot();
    this.update(timeDelta);
  }

  // updates player position based on its spot index
  updatePlayerSpot() {
    if (
      !this.updatingSpot ||
      !this.player ||
      this.playerSpotIdx === this.targetSpotIdx ||
      // don't update if doesn't loop and have hit ends
      (!this.loops &&
        (this.targetSpotIdx < 0 ||
          this.targetSpotIdx >= this.playerSpots.length))
    )
      return;

    // look for fastest path if loops
    const forwardTarget =
      this.targetSpotIdx < this.playerSpotIdx
        ? this.playerSpots.length + this.targetSpotIdx
        : this.targetSpotIdx;
    const forwardPath = forwardTarget - this.playerSpotIdx;

    const backwardTarget =
      this.targetSpotIdx > this.playerSpotIdx
        ? this.targetSpotIdx - this.playerSpots.length
        : this.targetSpotIdx;
    const backwardPath = backwardTarget - this.playerSpotIdx;

    // increment by 1 space in best direction
    if (Math.abs(forwardPath) < Math.abs(backwardPath)) {
      this.playerSpotIdx += 1;
      if (this.playerSpotIdx >= this.playerSpots.length) this.playerSpotIdx = 0;
    } else {
      this.playerSpotIdx -= 1;
      if (this.playerSpotIdx < 0)
        this.playerSpotIdx = this.playerSpots.length - 1;
    }

    this.player.setTransformWithProps(this.playerSpots[this.playerSpotIdx]);
  }

  startUpdatingWithCursor(x: number, y: number) {
    this.updatingSpot = true;
  }

  stopUpdatingWithCursor() {
    this.updatingSpot = false;
  }
}
