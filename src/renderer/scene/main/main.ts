import { EventType, Event } from '../../../game/event';
import { Main as GameMain } from '../../../game/scene/main/main';
import { Scene as GameScene } from '../../../game/scene/scene';
import { Effect } from './effect/effect';
import { AcceptorText } from './typist/acceptor';
import { ScoreBoard } from './typist/scoreBoard';
import { Scene } from '../scene';
import { Vector2 } from '../../commons/vector';
import { AddScore } from './effect/add-score';
import { Text } from '../../commons/text/text';
import { CenterText } from '../../commons/text/center-text';
import { InputText } from './typist/input-text';
import { setBrightNess } from '../../commons/screen';

export class Main implements Scene {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  currentWord: CenterText;
  acceptorTexts: AcceptorText[];
  scoreBoards: ScoreBoard[];
  effectText: Text;
  effects: Effect[];
  states: Record<number, (main: GameMain) => void>;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    // テキストの設定
    this.currentWord = new CenterText(this.width, new Text(this.ctx, '#000000', `bold 36px 'Meiryo', sans-serif`), 80);
    const inputText = new Text(this.ctx, '#ffffff', `bold 28px 'Yu Gothic', 'Meiryo', sans-serif`);
    const playerColor1 = '#ff880060';
    const playerColor2 = '#32cd3260';
    this.acceptorTexts = [
      new AcceptorText(this.ctx, new InputText(this.ctx, this.width, inputText, 190), playerColor1),
      new AcceptorText(this.ctx, new InputText(this.ctx, this.width, inputText, 320), playerColor2),
    ];
    const smallText = new Text(this.ctx, '#ffffff', `bold 24px 'Meiryo', sans-serif`);
    const largeText = new Text(this.ctx, '#ffffff', `50px 'Meiryo', sans-serif`);
    this.scoreBoards = [
      new ScoreBoard(this.ctx, 'YOU', playerColor1, largeText, smallText, new Vector2(228, 480)),
      new ScoreBoard(this.ctx, 'NPC', playerColor2, largeText, smallText, new Vector2(488, 480)),
    ];
    // エフェクトの初期化
    this.effectText = new Text(this.ctx, '#ffffff', `bold 60px 'Meiryo', sans-serif`);
    this.effects = [];
    this.states = {
      [GameMain.State.FadeIn]: this.renderFadeIn.bind(this),
      [GameMain.State.Wait]: this.renderWait.bind(this),
      [GameMain.State.Typing]: this.renderTyping.bind(this),
      [GameMain.State.FadeOut]: this.renderFadeOut.bind(this),
    };
  }

  initialize(): void {
    this.effects = [];
  }

  handle_events(events: Event[]): void {
    events.forEach((event) => {
      switch (event.type) {
        case EventType.Completed:
          {
            // スコアエフェクトを追加
            const { idx } = event.payload!;
            const score = this.scoreBoards[idx as number];
            const x = score.scorePos.x + score.scoreText.getSize('000').x;
            const y = score.scorePos.y;
            const color = score.color.substring(0, score.color.length - 2);
            this.effects.push(new AddScore(this.ctx, new Vector2(x, y), this.effectText, color));
          }
          break;
        default:
      }
    });
  }

  render(scene: GameScene): void {
    const main = scene as GameMain;
    this.states[main.state](main);
  }

  renderFadeIn(main: GameMain) {
    this.renderWait(main);
    setBrightNess(this.ctx, 1.0 - main.count / GameMain.FADE_FRAMES);
  }

  renderWait(main: GameMain) {
    this.ctx.fillStyle = '#ff8c00';
    this.ctx.fillRect(0, 0, this.width, 20);
    this.currentWord.draw('<Space>を押して開始');
    main.manager.typists.forEach((typist, idx) => {
      this.acceptorTexts[idx].drawRect(typist.acceptor.getCompletion());
      this.scoreBoards[idx].draw(typist.score);
    });
  }

  renderTyping(main: GameMain) {
    // 残り時間を矩形で描画する
    const elapsedTime = main.currentTime - main.startTime;
    const width = (this.width * (main.timeLimit - elapsedTime)) / main.timeLimit;
    this.ctx.fillStyle = '#ff8c00';
    this.ctx.fillRect(0, 0, width, 20);
    this.currentWord.draw(main.manager.currentWord.displayText);
    main.manager.typists.forEach((typist, idx) => {
      this.acceptorTexts[idx].draw(typist.acceptor);
      this.scoreBoards[idx].draw(typist.score);
    });
    this.effects = this.effects.filter((effect) => {
      effect.draw();
      return effect.isAlive();
    });
  }

  renderFadeOut(main: GameMain) {
    this.renderTyping(main);
    setBrightNess(this.ctx, main.count / GameMain.FADE_FRAMES);
  }
}
