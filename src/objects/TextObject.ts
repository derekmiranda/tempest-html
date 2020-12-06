import { BaseGameObject } from "./BaseGameObject";
import { GameObjectInterface, GameObjectPropsInterface } from "../types";
import { explosion } from "../lib/shapes";
import { renderPoints, sleep } from "../lib/utils";
import { COLORS } from "../CONSTS";

interface TextObjectPropsInterface extends GameObjectPropsInterface {
  text: string;
  blinking?: boolean;
}

export class TextObject extends BaseGameObject implements GameObjectInterface {
  color = COLORS.TEXT;
  text: string;
  blinking: boolean = false;
  visible: boolean = true;

  constructor(props: TextObjectPropsInterface) {
    super(props);
    if (props.blinking) {
      this.startBlink();
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
    if (!this.visible) return;
    this.ctx.strokeStyle = this.color;

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
