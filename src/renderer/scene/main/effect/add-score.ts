import { Vector2 } from "../../commons/vector";
import { Effect } from "./effect";
import { Text } from "../../commons/text/text";

export class AddScore implements Effect {
  ctx: CanvasRenderingContext2D;
  pos: Vector2;
  text: Text;
  color: string;
  count: number;
  alpha: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    pos: Vector2,
    text: Text,
    color: string
  ) {
    this.ctx = ctx;
    this.pos = pos;
    this.text = text;
    this.color = color;
    this.count = 60;
    this.alpha = 1.0;
  }

  /**
   * 生存フラグが立っているか
   */
  isAlive() {
    return this.count > 0;
  }

  /**
   * 描画する
   */
  draw() {
    this.ctx.font = this.text.font;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 4;
    this.ctx.globalAlpha = this.alpha;
    this.text.draw("+1", this.pos);
    this.ctx.strokeText("+1", this.pos.x, this.pos.y);
    this.ctx.globalAlpha = 1;
    this.pos.y -= 0.5;
    this.count -= 1;
    if (this.count <= 15) {
      this.alpha = this.count / 15;
    }
  }
}
