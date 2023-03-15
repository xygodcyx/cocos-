import { EntityTypeEnum } from "./../Common/Enum";
import { ActorManager } from "./../Entity/Actor/ActorManager";
import { JoyStickManager } from "./../UI/JoyStickManager";
import Singleton from "../Base/Singleton";
import { IActorMove, IState } from "../Common";
import { Prefab, SpriteFrame } from "cc";

export const ACTOR_SPEED: number = 100;
export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }
  jm: JoyStickManager;
  actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();
  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        position: {
          x: 0,
          y: 0,
        },
        direction: {
          x: 1,
          y: 0,
        },
      },
    ],
  };
  applyInput(input: IActorMove) {
    const {
      id,
      dt,
      direction: { x, y },
    } = input;
    const actor = this.state.actors.find((e) => id === e.id);
    actor.direction.x = x;
    actor.direction.y = y;

    actor.position.x += x * dt * ACTOR_SPEED;
    actor.position.y += y * dt * ACTOR_SPEED;
  }
}
