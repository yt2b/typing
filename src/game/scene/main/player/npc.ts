import { Player } from './player';

export class Npc implements Player {
  static State = {
    Wait: 0,
    Type: 1,
  } as const;
  state: number = Npc.State.Wait;
  inputs: string[];
  accuracy: number;
  prevTime: number;
  aveWaitTime: number;
  waitTime: number;
  aveStartTime: number;
  startTime: number;
  states: Record<number, (current: number) => string | undefined>;

  constructor(accuracy: number, kps: number, aveStartTime: number) {
    this.inputs = [];
    this.accuracy = accuracy;
    this.prevTime = 0;
    this.aveWaitTime = (60 * 1000) / kps;
    this.waitTime = this.aveWaitTime;
    this.aveStartTime = aveStartTime;
    this.startTime = this.aveStartTime;
    this.states = {
      [Npc.State.Wait]: this.wait.bind(this),
      [Npc.State.Type]: this.type.bind(this),
    };
  }

  setText(text: string): void {
    this.inputs = text.split('');
    this.state = Npc.State.Wait;
    this.prevTime = new Date().getTime();
    this.startTime = 300 + this.aveStartTime * (Math.random() * 0.8 + 0.6);
    this.waitTime = this.aveWaitTime * (Math.random() * 0.3 + 0.7);
  }

  getKey(): string | undefined {
    const current = new Date().getTime();
    return this.states[this.state](current);
  }

  wait(current: number): undefined {
    if (current - this.prevTime > this.startTime) {
      this.state = Npc.State.Type;
    }
    return undefined;
  }

  type(current: number): string | undefined {
    if (current - this.prevTime > this.waitTime) {
      this.prevTime = current;
      this.waitTime = this.aveWaitTime * (Math.random() * 0.3 + 0.7);
      if (Math.random() < this.accuracy) {
        return this.inputs.shift();
      } else {
        // 入力ミスしたら待機時間を少し延ばす
        this.waitTime *= 1.4;
      }
    }
    return undefined;
  }
}
