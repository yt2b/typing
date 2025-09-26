import { Acceptor } from '../../../../game/scene/main/typing/acceptor/acceptor';
import { Vector2 } from '../../../commons/vector';
import { Text } from '../../../commons/text/text';

export class InputText {
  ctx: CanvasRenderingContext2D;
  width: number;
  text: Text;
  pos: Vector2;

  constructor(ctx: CanvasRenderingContext2D, width: number, text: Text, y: number) {
    this.ctx = ctx;
    this.width = width;
    this.text = text;
    this.pos = new Vector2(0, y);
  }

  /**
   * 入力中の文字列を描画する
   * @param acceptor
   */
  draw(acceptor: Acceptor) {
    const history = acceptor.history;
    const completion = acceptor.completion;
    this.pos.x = (this.width - this.text.getSize(completion).x) / 2;
    // 入力済みの文字は半透明で表示
    this.ctx.globalAlpha = 0.15;
    this.text.draw(history, this.pos);
    // 未入力の文字は透過させずに表示
    this.ctx.globalAlpha = 1.0;
    const subCompletion = completion.substring(history.length);
    this.pos.x += this.text.getSize(history).x;
    this.text.draw(subCompletion, this.pos);
  }
}
