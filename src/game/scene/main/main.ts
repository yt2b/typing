import { Word } from '../../../word/word';
import { EventType } from '../../event';
import { Human } from './player/human';
import { Npc } from './player/npc';
import { AcceptorFactory } from './typing/acceptor/acceptor-factory';
import { createPatterns } from './typing/patterns';
import { TypistManager } from './typist/typist-manager';
import { Scene, SceneResult } from '../scene';
import { SceneType } from '../../game';
import { Result } from '../result/result';

export interface MainParam {
  timeLimit: number;
  accuracy: number;
  kpm: number;
  aveStartTime: number;
}

export class Main implements Scene {
  static State = {
    FadeIn: 0,
    Wait: 1,
    Typing: 2,
    FadeOut: 3,
  } as const;
  static readonly FADE_FRAMES = 10;
  states: Record<number, (key?: string) => SceneResult> = {
    [Main.State.FadeIn]: this.runFadeIn.bind(this),
    [Main.State.Wait]: this.runWait.bind(this),
    [Main.State.Typing]: this.runTyping.bind(this),
    [Main.State.FadeOut]: this.runFadeOut.bind(this),
  };
  state: number = Main.State.FadeIn;
  count: number = 0;
  timeLimit: number = 0;
  startTime: number = 0;
  currentTime: number = 0;
  human: Human;
  manager: TypistManager;

  constructor(words: Word[]) {
    const factory = new AcceptorFactory(createPatterns());
    this.human = new Human();
    this.manager = new TypistManager(words, factory, [this.human, new Npc(0.5, 100, 2000)]);
  }

  initialize(param?: unknown): void {
    this.state = Main.State.FadeIn;
    this.count = 0;
    if (param !== undefined) {
      const { timeLimit, accuracy, kpm, aveStartTime } = param as MainParam;
      this.timeLimit = timeLimit;
      const npc = new Npc(accuracy, kpm, aveStartTime);
      this.manager.setPlayers([this.human, npc]);
    }
  }

  update(key?: string): SceneResult {
    this.count++;
    return this.states[this.state](key);
  }

  runFadeIn(_?: string): SceneResult {
    if (this.count >= Main.FADE_FRAMES) {
      this.state = Main.State.Wait;
      this.count = 0;
    }
    return { sceneType: SceneType.Main, events: [] };
  }

  runWait(key?: string): SceneResult {
    if (key == ' ') {
      this.state = Main.State.Typing;
      this.count = 0;
      this.startTime = new Date().getTime();
      return { sceneType: SceneType.Main, events: [{ type: EventType.Start }] };
    }
    return { sceneType: SceneType.Main, events: [] };
  }

  runTyping(key?: string): SceneResult {
    if (key !== undefined && key.length == 1) {
      this.human.setKey(key);
    }
    const events = this.manager.update();
    this.currentTime = new Date().getTime();
    if (this.currentTime - this.startTime >= this.timeLimit) {
      this.state = Main.State.FadeOut;
      this.count = 0;
    }
    return { sceneType: SceneType.Main, events: events };
  }

  runFadeOut(_?: string): SceneResult {
    if (this.count >= Main.FADE_FRAMES) {
      // 結果画面に遷移する
      let battle = Result.Battle.Draw;
      const human = this.manager.typists[0];
      const npc = this.manager.typists[1];
      if (human.score > npc.score) {
        battle = Result.Battle.Win;
      } else if (human.score < npc.score) {
        battle = Result.Battle.Lose;
      }
      const statistics = {
        timeLimit: this.timeLimit,
        battle: battle,
        score: human.score,
        countTotalTyping: human.countTotalTyping,
        countMissTyping: human.countMissTyping,
      };
      return { sceneType: SceneType.Result, events: [], param: statistics };
    }
    return { sceneType: SceneType.Main };
  }
}
