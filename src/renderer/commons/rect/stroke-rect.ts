import { Vector2 } from '../vector';

export class StrokeRect {
  ctx: CanvasRenderingContext2D;
  strokeColor: string;
  fillColor: string;
  pos: Vector2;
  size: Vector2;
  strokeWidth: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    strokeColor: string,
    fillColor: string,
    pos: Vector2,
    size: Vector2,
    strokeWidth: number,
  ) {
    this.ctx = ctx;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.pos = pos;
    this.size = size;
    this.strokeWidth = strokeWidth;
  }

  /**
   * 枠付きの矩形を描画する
   */
  draw() {
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}
