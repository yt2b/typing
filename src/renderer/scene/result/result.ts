import { Event } from '../../../game/event';
import { Result as GameResult } from '../../../game/scene/result/result';
import { Scene as GameScene } from '../../../game/scene/scene';
import { Scene } from '../scene';
import { setBrightNess } from '../../commons/screen';
import { CenterText } from '../../commons/text/center-text';
import { Text } from '../../commons/text/text';
import { Vector2 } from '../../commons/vector';

export class Result implements Scene {
  states: Record<number, (main: GameResult) => void> = {
    [GameResult.State.FadeIn]: this.renderFadeIn.bind(this),
    [GameResult.State.Select]: this.renderSelect.bind(this),
    [GameResult.State.FadeOut]: this.renderFadeOut.bind(this),
  };
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  battle: CenterText;
  statistics: Text;
  operation: CenterText;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.battle = new CenterText(this.width, new Text(this.ctx, '#000000', `bold 48px 'Meiryo', sans-serif`), 50);
    const text = new Text(this.ctx, '#000000', `bold 25px 'Meiryo', sans-serif`);
    this.statistics = new Text(this.ctx, '#000000', `bold 36px 'Meiryo', sans-serif`);
    this.operation = new CenterText(this.width, text, height - 10);
  }

  initialize(): void {}

  handle_events(_: Event[]): void {}

  render(scene: GameScene): void {
    const result = scene as GameResult;
    this.states[result.state](result);
  }

  renderFadeIn(result: GameResult) {
    this.renderSelect(result);
    setBrightNess(this.ctx, 1.0 - result.count / GameResult.FADE_FRAMES);
  }

  renderSelect(result: GameResult) {
    this.ctx.fillStyle = '#ffffff';
    switch (result.statistics?.battle) {
      case GameResult.Battle.Win:
        this.battle.draw('You win!！');
        break;
      case GameResult.Battle.Lose:
        this.battle.draw('You lose..');
        break;
      case GameResult.Battle.Draw:
        this.battle.draw('Draw');
        break;
    }
    this.statistics.draw('スコア', new Vector2(160, 150));
    this.statistics.draw('総打鍵数', new Vector2(160, 210));
    this.statistics.draw('ミス数', new Vector2(160, 270));
    this.statistics.draw('入力速度', new Vector2(160, 330));
    this.statistics.draw('正確性', new Vector2(160, 390));
    const ss = result.statistics;
    if (ss !== undefined) {
      this.statistics.draw(`${ss.score}`, new Vector2(460, 150));
      this.statistics.draw(`${ss.countTotalTyping}`, new Vector2(460, 210));
      this.statistics.draw(`${ss.countMissTyping}`, new Vector2(460, 270));
      this.statistics.draw(`${(ss.countTotalTyping / (ss.timeLimit / 1000)).toFixed(1)}文字/秒`, new Vector2(460, 330));
      let accuracy = 100;
      if (ss.countTotalTyping != 0) {
        accuracy = ((ss.countTotalTyping - ss.countMissTyping) / ss.countTotalTyping) * 100;
      }
      this.statistics.draw(`${accuracy.toFixed(0)}%`, new Vector2(460, 390));
    }
    this.operation.draw('<Space>:タイトルに戻る');
  }

  renderFadeOut(result: GameResult) {
    this.renderSelect(result);
    setBrightNess(this.ctx, result.count / GameResult.FADE_FRAMES);
  }
}
