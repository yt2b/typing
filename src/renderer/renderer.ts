import { SceneType } from '../game/game';
import { Event } from '../game/event';
import { Scene } from './scene/scene';
import { Scene as GameScene } from '../game/scene/scene';
import { Main } from './scene/main/main';
import { Title } from './scene/title/title';
import { Result } from './scene/result/result';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scenes: Record<SceneType, Scene>;
  prevSceneType?: SceneType;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = parseFloat(getComputedStyle(this.canvas).width);
    this.height = parseFloat(getComputedStyle(this.canvas).height);
    // キャンバスの解像度を画面のスケーリングに合わせる
    const ratio = window.devicePixelRatio;
    this.canvas.width = this.width * ratio;
    this.canvas.height = this.height * ratio;
    this.ctx.scale(ratio, ratio);
    this.scenes = {
      [SceneType.Title]: new Title(this.ctx, this.width, this.height),
      [SceneType.Main]: new Main(this.ctx, this.width, this.height),
      [SceneType.Result]: new Result(this.ctx, this.width, this.height),
    };
  }

  /**
   * イベントに対応する
   * @param events ゲームイベントの配列
   */
  handle_events(sceneType: SceneType, events: Event[]) {
    this.scenes[sceneType].handle_events(events);
  }

  /**
   * 画面上に描画する
   * @param game ゲームロジック
   */
  render(sceneType: SceneType, scene: GameScene) {
    this.ctx.fillStyle = '#f8f8f8';
    this.ctx.fillRect(0, 0, this.width, this.height);
    if (sceneType !== this.prevSceneType) {
      this.prevSceneType = sceneType;
      this.scenes[sceneType].initialize();
    }
    this.scenes[sceneType].render(scene);
  }
}
