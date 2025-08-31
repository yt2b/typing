import { Vector2 } from '../vector';

export class Text {
  ctx: CanvasRenderingContext2D;
  color: string;
  font: string;

  constructor(ctx: CanvasRenderingContext2D, color: string, font: string) {
    this.ctx = ctx;
    this.color = color;
    this.font = font;
  }

  /**
   * テキストスタイルを適用させる
   */
  setStyle() {
    this.ctx.fillStyle = this.color;
    this.ctx.font = this.font;
  }

  /**
   * 文字列のサイズを取得する
   * @param text 文字列
   * @returns (幅、高さ)のベクタ
   */
  getSize(text: string): Vector2 {
    this.setStyle();
    const measure = this.ctx.measureText(text);
    const width = measure.width;
    const height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
    return new Vector2(width, height);
  }

  /**
   * 文字列を描画する
   * @param text 文字列
   * @param pos 文字列の左下の座標
   */
  draw(text: string, pos: Vector2) {
    this.setStyle();
    this.ctx.fillText(text, pos.x, pos.y);
  }
}
