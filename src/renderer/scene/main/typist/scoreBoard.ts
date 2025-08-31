import { StrokeRect } from '../../../commons/rect/stroke-rect';
import { Vector2 } from '../../../commons/vector';
import { Text } from '../../../commons/text/text';

export class ScoreBoard {
  name: string;
  color: string;
  scoreText: Text;
  nameText: Text;
  scorePos: Vector2;
  namePos: Vector2;
  rect: StrokeRect;

  constructor(
    ctx: CanvasRenderingContext2D,
    name: string,
    color: string,
    scoreText: Text,
    nameText: Text,
    scorePos: Vector2,
  ) {
    this.name = name;
    this.color = color;
    this.nameText = nameText;
    this.scoreText = scoreText;
    this.scorePos = scorePos;
    // 名前の座標を計算
    const sizeScore = this.scoreText.getSize('000');
    const sizeName = this.nameText.getSize(this.name);
    const nameX = this.scorePos.x + (sizeScore.x - sizeName.x) / 2;
    const nameY = this.scorePos.y - sizeScore.y - 10;
    this.namePos = new Vector2(nameX, nameY);
    // 枠の座標とサイズを計算
    const padX = 40;
    const padY = 30;
    const h = sizeScore.y + sizeName.y;
    const pos = new Vector2(this.scorePos.x - padX, this.scorePos.y - h - padY);
    const size = new Vector2(sizeScore.x + padX * 2, h + padY * 2);
    this.rect = new StrokeRect(ctx, color, '#000000c0', pos, size, 12);
  }

  /**
   * 描画する
   * @param score 現在のスコア
   */
  draw(score: number) {
    this.rect.draw();
    this.scoreText.draw(score.toString().padStart(3, '0'), this.scorePos);
    this.nameText.draw(this.name, this.namePos);
  }
}
