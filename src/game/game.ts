import { Word } from '../word/word';
import { Event } from './event';
import { Main } from './scene/main/main';
import { Scene } from './scene/scene';
import { Title } from './scene/title/title';

export enum SceneType {
  Title,
  Main,
}

export class Game {
  sceneType: SceneType;
  nextSceneType: SceneType;
  param?: unknown;
  scenes: Record<SceneType, Scene>;
  events: Event[];

  constructor(words: Word[]) {
    this.sceneType = this.nextSceneType = SceneType.Title;
    this.scenes = {
      [SceneType.Title]: new Title(),
      [SceneType.Main]: new Main(words),
    };
    this.events = [];
  }

  /**
   * ゲーム状態を更新する
   * @param key 入力したキー
   */
  update(key?: string) {
    if (this.sceneType != this.nextSceneType) {
      this.scenes[this.nextSceneType].initialize(this.param);
    }
    this.sceneType = this.nextSceneType;
    const { sceneType, events, param } = this.getScene().update(key);
    this.nextSceneType = sceneType;
    this.param = param;
    if (events !== undefined) {
      this.events = this.events.concat(events);
    }
  }

  /**
   * updateにより発生したイベントを取得する
   * @returns
   */
  getEvents() {
    const events = this.events;
    this.events = [];
    return events;
  }

  /**
   * 現在のシーンを返す
   * @returns
   */
  getScene(): Scene {
    return this.scenes[this.sceneType];
  }
}
