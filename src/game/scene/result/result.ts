import { EventType, Event } from '../../event';
import { SceneType } from '../../game';
import { Scene, SceneResult } from '../scene';

export interface Statistics {
  battle: number;
  score: number;
  countTotalTyping: number;
  countMissTyping: number;
}

export class Result implements Scene {
  static State = {
    FadeIn: 0,
    Select: 1,
    FadeOut: 2,
  } as const;
  static Battle = {
    Win: 0,
    Lose: 1,
    Draw: 2,
  };
  static readonly FADE_FRAMES = 10;
  states: Record<number, (key?: string) => SceneResult> = {
    [Result.State.FadeIn]: this.runFadeIn.bind(this),
    [Result.State.Select]: this.runSelect.bind(this),
    [Result.State.FadeOut]: this.runFadeOut.bind(this),
  };
  state: number = Result.State.FadeIn;
  count: number = 0;
  statistics: Statistics | undefined;

  constructor() {}

  initialize(param?: unknown): void {
    this.statistics = param as Statistics;
    this.state = Result.State.FadeIn;
    this.count = 0;
  }

  update(key?: string): SceneResult {
    this.count++;
    return this.states[this.state](key);
  }

  runFadeIn(_?: string): SceneResult {
    if (this.count >= Result.FADE_FRAMES) {
      this.state = Result.State.Select;
      this.count = 0;
    }
    return { sceneType: SceneType.Result };
  }

  runSelect(key?: string): SceneResult {
    const events: Event[] = [];
    if (key == ' ') {
      this.state = Result.State.FadeOut;
      this.count = 0;
      events.push({ type: EventType.Select });
    }
    return { sceneType: SceneType.Result, events: events };
  }

  runFadeOut(_?: string): SceneResult {
    if (this.count >= Result.FADE_FRAMES) {
      return { sceneType: SceneType.Title };
    }
    return { sceneType: SceneType.Result };
  }
}
