import { Vector2 } from '../vector';
import { Text } from './text';

export class CenterText {
  width: number;
  text: Text;
  pos: Vector2;

  constructor(width: number, text: Text, y: number) {
    this.width = width;
    this.text = text;
    this.pos = new Vector2(0, y);
  }

  /**
   * 文字列を描画する
   * @param text 文字列
   */
  draw(text: string) {
    this.pos.x = (this.width - this.text.getSize(text).x) / 2;
    this.text.draw(text, this.pos);
  }
}
