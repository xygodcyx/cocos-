import { WeaponStateMachine } from "./WeaponStateMachine";
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
import { EntityStateEnum } from "../../Enum";
const { ccclass } = _decorator;

@ccclass("WeaponManager")
export class WeaponManager extends EntityManager {
  init(data: IActor) {
    this.fsm = this.addComponent(WeaponStateMachine);
    this.fsm.init(data.type);
    this.state = EntityStateEnum.Idle;

    const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1);
    const weapon = instantiate(prefab);
    weapon.setParent(this.node);
    weapon.addComponent();
  }
}
