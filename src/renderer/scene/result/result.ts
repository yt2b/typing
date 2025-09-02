import { Event } from '../../../game/event';
import { Result as GameResult } from '../../../game/scene/result/result';
import { Scene as GameScene } from '../../../game/scene/scene';
import { Scene } from '../scene';
import { setBrightNess } from '../../commons/screen';

export class Result implements Scene {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  states: Record<number, (main: GameResult) => void>;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.states = {
      [GameResult.State.FadeIn]: this.renderFadeIn.bind(this),
      [GameResult.State.Select]: this.renderSelect.bind(this),
      [GameResult.State.FadeOut]: this.renderFadeOut.bind(this),
    };
  }

  initialize(): void {}

  handle_events(_: Event[]): void {}

  render(scene: GameScene): void {
    this.ctx.fillStyle = '#f8f8f8';
    this.ctx.fillRect(0, 0, this.width, this.height);
    const result = scene as GameResult;
    this.states[result.state](result);
  }

  renderFadeIn(result: GameResult) {
    this.renderSelect(result);
    setBrightNess(this.ctx, 1.0 - result.count / GameResult.FADE_FRAMES);
  }

  renderSelect(_: GameResult) {}

  renderFadeOut(result: GameResult) {
    this.renderSelect(result);
    setBrightNess(this.ctx, result.count / GameResult.FADE_FRAMES);
  }
}
