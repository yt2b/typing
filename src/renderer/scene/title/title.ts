import { Event } from '../../../game/event';
import { Title as GameTitle } from '../../../game/scene/title/title';
import { Scene as GameScene } from '../../../game/scene/scene';
import { CenterText } from '../../commons/text/center-text';
import { Scene } from '../scene';
import { Text } from '../../commons/text/text';
import { Vector2 } from '../../commons/vector';
import { DiffBoard } from './diff-board';
import { setBrightNess } from '../../commons/screen';

export class Title implements Scene {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  displayText: CenterText;
  description: CenterText;
  operation: CenterText;
  boards: DiffBoard[];

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.displayText = new CenterText(this.width, new Text(this.ctx, '#000000', `bold 90px 'Meiryo', sans-serif`), 80);
    const text = new Text(this.ctx, '#000000', `bold 30px 'Meiryo', sans-serif`);
    this.description = new CenterText(this.width, text, 140);
    this.operation = new CenterText(this.width, text, height - 10);
    const largeText = new Text(this.ctx, '#ffffff', `bold 80px 'Meiryo', sans-serif`);
    const smallText = new Text(this.ctx, '#ffffff', `bold 30px 'Meiryo', sans-serif`);
    this.boards = [];
    for (let i = 0; i < 3; i++) {
      const pos = new Vector2((1024 - 600) / 2, 200 + (120 + 50) * i);
      this.boards.push(new DiffBoard(this.ctx, largeText, smallText, pos));
    }
  }

  initialize(): void {}

  handle_events(_: Event[]): void {}

  render(scene: GameScene): void {
    this.displayText.draw('VS Typing');
    this.description.draw('表示された文章をNPCよりも速く入力してください');
    this.operation.draw('↑↓:選択  <Space>:決定');
    const title = scene as GameTitle;
    title.difficulties.forEach((diff, idx) => {
      this.boards[idx].isSelected = title.idx == idx;
      this.boards[idx].render(diff);
    });
    // フェードアウト
    if (title.state === GameTitle.State.Fadeout) {
      setBrightNess(this.ctx, title.count / GameTitle.FADE_FRAMES);
    }
  }
}
