import { Key } from '../../../input/input';
import { EventType } from '../../event';
import { SceneType } from '../../game';
import { MainParam } from '../main/main';
import { Scene, SceneResult } from '../scene';

export interface Difficultiy {
  name: string;
  param: MainParam;
}

export class Title implements Scene {
  static State = {
    Select: 0,
    Fadeout: 1,
  } as const;
  static readonly FADE_FRAMES = 10; // フェードアウトにかけるフレーム数
  difficulties: Difficultiy[];
  idx: number = 0;
  state: number = Title.State.Select;
  count: number = 0;
  states: Record<number, (key?: string) => SceneResult>;

  constructor() {
    this.difficulties = [
      { name: '初級', param: { timeLimit: 30000, accuracy: 0.8, kpm: 180, aveStartTime: 1500 } },
      { name: '中級', param: { timeLimit: 45000, accuracy: 0.9, kpm: 450, aveStartTime: 1000 } },
      { name: '上級', param: { timeLimit: 60000, accuracy: 0.95, kpm: 530, aveStartTime: 1000 } },
    ];
    this.states = {
      [Title.State.Select]: this.runSelect.bind(this),
      [Title.State.Fadeout]: this.runFadeout.bind(this),
    };
  }

  initialize(_?: unknown): void {
    this.idx = 0;
    this.state = Title.State.Select;
    this.count = 0;
  }

  update(key?: string): SceneResult {
    return this.states[this.state](key);
  }

  runSelect(key?: string): SceneResult {
    switch (key) {
      case Key.Up:
        this.idx -= 1;
        if (this.idx < 0) {
          this.idx = this.difficulties.length - 1;
        }
        break;
      case Key.Down:
        this.idx += 1;
        if (this.idx >= this.difficulties.length) {
          this.idx = 0;
        }
        break;
      case ' ':
        this.state = Title.State.Fadeout;
        this.count = 0;
        break;
    }
    return { sceneType: SceneType.Title };
  }

  runFadeout(_?: string): SceneResult {
    this.count++;
    if (this.count >= Title.FADE_FRAMES) {
      const param = this.difficulties[this.idx].param;
      return { sceneType: SceneType.Main, events: [{ type: EventType.Select }], param: param };
    }
    return { sceneType: SceneType.Title };
  }
}
