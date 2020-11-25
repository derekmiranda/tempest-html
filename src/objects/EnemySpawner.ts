import { sleep } from "../lib/utils";
import { GameObjectPropsInterface } from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Enemy } from "./Enemy";
import { Level } from "./Level";
import { RedEnemy } from "./RedEnemy";

interface EnemySpawnerPropsInterface extends GameObjectPropsInterface {
  level: Level;
  enemyClasses: typeof Enemy[];
  startingZ?: number;
  zIncrement?: number;
}

export class EnemySpawner extends BaseGameObject {
  static enemySizeMap: Map<typeof Enemy, number> = new Map<
    typeof Enemy,
    number
  >([[RedEnemy, 0.65]]);
  // z that nearest enemy will start with
  startingZ: number = 1.1;
  // z distance subsequent enemies start at
  zIncrement: number = 0.1;

  level: Level;
  enemyClasses: typeof Enemy[];

  constructor(props: EnemySpawnerPropsInterface) {
    super(props);

    const { startingZ, zIncrement } = props;
    if (startingZ) this.startingZ = startingZ;
    if (zIncrement) this.zIncrement = zIncrement;
  }

  spawnEnemies() {
    this.enemyClasses.forEach((enemyClass, i) => {
      const size = EnemySpawner.enemySizeMap.get(enemyClass);
      const newEnemy = new enemyClass({
        ...this.game.getDefaultProps(),
        w: size,
        h: size,
        z: this.startingZ + this.zIncrement * i,
      });
      this.level.addEnemy(newEnemy);
    });
  }
}
