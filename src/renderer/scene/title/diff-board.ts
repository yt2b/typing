import { Difficultiy } from '../../../game/scene/title/title';
import { StrokeRect } from '../../commons/rect/stroke-rect';
import { Text } from '../../commons/text/text';
import { Vector2 } from '../../commons/vector';

export class DiffBoard {
  ctx: CanvasRenderingContext2D;
  largeText: Text;
  smallText: Text;
  pos: Vector2;
  size: Vector2;
  isSelected: boolean;
  difficultyTextPos: Vector2;
  timeLimitTextPos: Vector2;
  speedTextPos: Vector2;
  accuracyTextPos: Vector2;

  constructor(ctx: CanvasRenderingContext2D, size: Vector2, largeText: Text, smallText: Text, pos: Vector2) {
    this.ctx = ctx;
    this.largeText = largeText;
    this.smallText = smallText;
    this.pos = pos;
    this.size = size;
    this.isSelected = false;
    const height = this.largeText.getSize('A').y;
    const y = pos.y + (this.size.y + height) / 2;
    this.difficultyTextPos = new Vector2(pos.x + 50, y);
    const smallTextWidth = this.smallText.getSize('A').y;
    const smallTextY = this.pos.y + (this.size.y + smallTextWidth) / 2;
    this.timeLimitTextPos = new Vector2(this.difficultyTextPos.x + 200, smallTextY - smallTextWidth * 1.5);
    this.speedTextPos = new Vector2(this.difficultyTextPos.x + 200, smallTextY);
    this.accuracyTextPos = new Vector2(this.difficultyTextPos.x + 200, smallTextY + smallTextWidth * 1.5);
  }

  render(diff: Difficultiy) {
    const color = this.isSelected ? '#ff8800a0' : '#442200';
    new StrokeRect(this.ctx, color, '#444444', this.pos, this.size, 12).draw();
    this.ctx.globalAlpha = this.isSelected ? 1.0 : 0.05;
    this.largeText.draw(diff.name, this.difficultyTextPos);
    this.smallText.draw(`制限時間: ${diff.param.timeLimit / 1000}秒`, this.timeLimitTextPos);
    this.smallText.draw(`NPCの速度: ${(diff.param.kpm / 60).toFixed(1)}文字/秒`, this.speedTextPos);
    this.smallText.draw(`NPCの正確性: ${diff.param.accuracy * 100}%`, this.accuracyTextPos);
    this.ctx.globalAlpha = 1.0;
  }
}
