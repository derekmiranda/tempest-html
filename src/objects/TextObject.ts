import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { explosion } from "../lib/shapes";
import { renderPoints, sleep } from "../lib/utils";
import { COLORS } from "../CONSTS";

interface TextObjectPropsInterface extends GameObjectPropsInterface {
  text: string;
  blinking?: boolean;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

export class TextObject extends BaseGameObject implements GameObjectInterface {
  color = COLORS.TEXT;
  text: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  blinking: boolean = false;

  constructor(props: TextObjectPropsInterface) {
    super(props);
    if (props.blinking && this.visible) {
      this.startBlink();
    }
    if (!props.textAlign) {
      this.textAlign = "center";
    }
    if (!props.textBaseline) {
      this.textBaseline = "alphabetic";
    }
  }

  updateText(text) {
    this.text = text;
  }

  async startBlink() {
    await sleep(500);
    if (this.rendered) {
      this.visible = !this.visible;
      this.startBlink();
    }
  }

  render() {
    this.ctx.strokeStyle = this.color;
    this.ctx.save();

    // apply specific text props
    this.ctx.textAlign = this.textAlign;
    this.ctx.textBaseline = this.textBaseline;

    // relative font size based on object height
    const fontSize = this.transform.h * this.ctx.canvas.height;
    this.ctx.font = fontSize + "px VectorBattle";
    this.ctx.strokeText(
      this.text,
      this.ctx.canvas.width * (this.globalTransform.x + 0.5),
      this.ctx.canvas.height * (this.globalTransform.y + 0.5)
    );
  }
}
