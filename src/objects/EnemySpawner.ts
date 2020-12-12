import { RED_ENEMY_SIZE } from "../CONSTS";
import { sleep } from "../lib/utils";
import { GameObjectPropsInterface } from "../types";
import { BaseGameObject } from "./BaseGameObject";
import { Enemy } from "./Enemy";
import { Level } from "./Level";
import { RedEnemy } from "./RedEnemy";

interface EnemySpawnerPropsInterface extends GameObjectPropsInterface {
  level: Level;
  enemyClasses: typeof Enemy[];
  enemySpeed?: number;
  startingZ?: number;
  zIncrement?: number;
}

export class EnemySpawner extends BaseGameObject {
  static enemySizeMap: Map<typeof Enemy, number> = new Map<
    typeof Enemy,
    number
  >([[RedEnemy, RED_ENEMY_SIZE]]);
  enemySpeed: number;
  // z that nearest enemy will start with
  startingZ: number = 1.1;
  // z distance subsequent enemies start at
  zIncrement: number = 0.1;

  level: Level;
  enemyClasses: typeof Enemy[];

  constructor(props: EnemySpawnerPropsInterface) {
    super(props);

    const { startingZ, zIncrement, enemySpeed } = props;
    if (startingZ) this.startingZ = startingZ;
    if (zIncrement) this.zIncrement = zIncrement;
    if (enemySpeed) this.enemySpeed = enemySpeed;
  }

  spawnEnemies() {
    this.enemyClasses.forEach((enemyClass, i) => {
      const size = EnemySpawner.enemySizeMap.get(enemyClass);
      const newEnemy = new enemyClass({
        ...this.game.getDefaultProps(),
        level: this.level,
        w: size,
        h: size,
        z: this.startingZ + this.zIncrement * i,
        speed: this.enemySpeed,
      });
      this.level.addEnemy(newEnemy);
    });
  }
}
