import { Vector2 } from '../../../commons/vector';
import { Acceptor } from '../../../../game/scene/main/typing/acceptor';
import { StrokeRect } from '../../../commons/rect/stroke-rect';
import { InputText } from './input-text';

export class AcceptorText {
  ctx: CanvasRenderingContext2D;
  inputText: InputText;
  strokeColor: string;

  constructor(ctx: CanvasRenderingContext2D, inputText: InputText, strokeColor: string) {
    this.ctx = ctx;
    this.inputText = inputText;
    this.strokeColor = strokeColor;
  }

  /**
   * 枠を描画する
   * @param text 入力中の文字列
   */
  drawRect(text: string) {
    const sizeText = this.inputText.text.getSize(text);
    const padX = 20;
    const padY = 30;
    const pos = new Vector2((this.inputText.width - sizeText.x) / 2 - padX, this.inputText.pos.y - sizeText.y - padY);
    const size = new Vector2(sizeText.x + padX * 2, sizeText.y + padY * 2);
    new StrokeRect(this.ctx, this.strokeColor, '#444444', pos, size, 12).draw();
  }

  /**
   * 現在入力中の文字列を枠付きで描画する
   * @param acceptor アクセプター
   */
  draw(acceptor: Acceptor) {
    this.drawRect(acceptor.completion);
    this.inputText.draw(acceptor);
  }
}
