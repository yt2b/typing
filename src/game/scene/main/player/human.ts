import { Player } from './player';

export class Human implements Player {
  inputs: string[];

  constructor() {
    this.inputs = [];
  }

  setText(_: string): void {}

  getKey(): string | undefined {
    return this.inputs.shift();
  }

  setKey(key: string) {
    this.inputs.push(key);
  }
}
