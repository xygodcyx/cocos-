import { EntityTypeEnum } from "./../Common/Enum";
import { PrefabPathEnum, TexturePathEnum } from "./../Enum/index";
import { ActorManager } from "./../Entity/Actor/ActorManager";
import { ResourceManager } from "./../Global/ResourceManager";
import { JoyStickManager } from "./../UI/JoyStickManager";
import {
  _decorator,
  Component,
  EventTouch,
  input,
  Input,
  Vec2,
  Node,
  UITransform,
  Prefab,
  instantiate,
  SpriteFrame,
} from "cc";
import DataManager from "../Global/DataManager";
const { ccclass } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
  private stage: Node;
  private ui: Node;

  private shouldUpdate = false;
  onLoad() {
    this.stage = this.node.getChildByName("Stage");
    this.ui = this.node.getChildByName("UI");
    this.stage.destroyAllChildren();
    DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager);
  }
  async start() {
    await this.loadRes();
    this.initMap();
    this.shouldUpdate = true;
  }
  async loadRes() {
    const list = [];
    for (const type in PrefabPathEnum) {
      const p = ResourceManager.Instance.loadRes(
        PrefabPathEnum[type],
        Prefab
      ).then((prefab) => {
        DataManager.Instance.prefabMap.set(type, prefab);
      });
      list.push(p);
    }
    for (const type in TexturePathEnum) {
      const p = ResourceManager.Instance.loadDir(
        TexturePathEnum[type],
        SpriteFrame
      ).then((spriteFrames) => {
        DataManager.Instance.textureMap.set(type, spriteFrames);
      });
      list.push(p);
    }
    await Promise.all(list);
  }
  initMap() {
    const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map);
    const map = instantiate(prefab);
    map.setParent(this.stage);
  }
  update(dt) {
    if (!this.shouldUpdate) {
      return;
    }
    this.rander();
    this.tick(dt);
  }
  tick(dt) {
    this.tickActor(dt);
  }
  tickActor(dt) {
    for (const data of DataManager.Instance.state.actors) {
      const { id } = data;
      let am = DataManager.Instance.actorMap.get(id);
      am.tick(dt);
    }
  }
  rander() {
    this.renderActor();
  }
  async renderActor() {
    for (const data of DataManager.Instance.state.actors) {
      const { id, type } = data;
      let am = DataManager.Instance.actorMap.get(id);
      if (!am) {
        const prefab = DataManager.Instance.prefabMap.get(type);
        const actor = instantiate(prefab);
        actor.setParent(this.stage);
        am = actor.addComponent(ActorManager);
        DataManager.Instance.actorMap.set(id, am);
        am.init(data);
      } else {
        am.render(data);
      }
    }
  }
}
