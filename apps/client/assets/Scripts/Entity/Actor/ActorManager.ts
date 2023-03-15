import { EventEnum } from "./../../Enum/index";
import { IActor } from "./../../Common/State";
import { EntityTypeEnum, InputTypeEnum } from "./../../Common/Enum";
import {
  _decorator,
  Component,
  EventTouch,
  input,
  Input,
  Vec2,
  Node,
  UITransform,
  instantiate,
} from "cc";
import DataManager from "../../Global/DataManager";
import { EntityManager } from "../../Base/EntityManager";
import { ActorStateMachine } from "./ActorStateMachine";
import { EntityStateEnum } from "../../Enum";
const { ccclass } = _decorator;

@ccclass("ActorManager")
export class ActorManager extends EntityManager {
  init(data: IActor) {
    this.fsm = this.addComponent(ActorStateMachine);
    this.fsm.init(data.type);
    this.state = EntityStateEnum.Idle;

    const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1);
    const weapon = instantiate(prefab);
    weapon.setParent(this.node);
    weapon.addComponent();
  }
  tick(dt) {
    // input只要改变了，length就不是0，就会执行
    if (DataManager.Instance.jm.input.length()) {
      const { x, y } = DataManager.Instance.jm.input;
      DataManager.Instance.applyInput({
        id: 1,
        type: InputTypeEnum.ActorMove,
        direction: {
          x,
          y,
        },
        dt,
      });
      console.log(
        DataManager.Instance.state.actors[0].position.x,
        DataManager.Instance.state.actors[0].position.y
      );
      this.state = EntityStateEnum.Run;
    } else {
      this.state = EntityStateEnum.Idle;
    }
  }
  render(data: IActor) {
    const { direction, position } = data;
    this.node.setPosition(position.x, position.y);
    if (direction.x !== 0) {
      this.node.setScale(direction.x > 0 ? 1 : -1, 1);
    }
  }
}
