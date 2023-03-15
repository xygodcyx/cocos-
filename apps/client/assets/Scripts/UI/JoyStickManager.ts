import {
  _decorator,
  Component,
  EventTouch,
  input,
  Input,
  Vec2,
  Node,
  UITransform,
} from "cc";
const { ccclass } = _decorator;

@ccclass("JoyStickManager")
export class JoyStickManager extends Component {
  input: Vec2 = Vec2.ZERO;
  private body: Node;
  private stick: Node;
  private defPosition: Vec2;
  private radius: number;
  onLoad() {
    this.body = this.node.getChildByName("Body");
    this.stick = this.body.getChildByName("Stick");
    this.defPosition = new Vec2(this.body.position.x, this.body.position.y);
    this.radius = this.body.getComponent(UITransform).contentSize.x / 2;
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchStart(e: EventTouch) {
    const touchPos = e.getUILocation();
    this.body.setPosition(touchPos.x, touchPos.y);
    // console.log(e.getUILocation()); // Location on UI space
  }
  onTouchMove(e: EventTouch) {
    const touchPos = e.getUILocation();
    const stickPos = new Vec2(
      touchPos.x - this.body.position.x,
      touchPos.y - this.body.position.y
    );
    if (stickPos.length() >= this.radius) {
      // this.radius / stickPos.length();//让这个数字在1以内
      stickPos.multiplyScalar(this.radius / stickPos.length()); //再让stickPos乘着个数字，但是move一下，就乘以一下，所以stickPos的值是不会变的很小的，因为只要大于一点立马让这个数字趋于1
      // console.log(this.radius / stickPos.length());
    }
    this.stick.setPosition(stickPos.x, stickPos.y);
    this.input = stickPos.clone().normalize();
    // console.log(this.input);
  }
  onTouchEnd() {
    this.body.setPosition(this.defPosition.x, this.defPosition.y);
    this.stick.setPosition(0, 0);
    this.input = Vec2.ZERO;
  }
}
