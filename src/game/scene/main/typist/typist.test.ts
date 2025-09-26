import { Typist } from './typist';
import { Player } from '../player/player';
import { AcceptorFactory } from '../typing/acceptor/acceptor-factory';
import { createPatterns } from '../typing/patterns';
import { EventType } from '../../../event';

class MockPlayer implements Player {
  keys: string[];

  constructor(input: string) {
    this.keys = input.split('');
  }

  getKey(): string | undefined {
    return this.keys.shift();
  }

  setText(_: string): void {}
}

describe('Typist', () => {
  const factory: AcceptorFactory = new AcceptorFactory(createPatterns());

  it('Create Instance', () => {
    const player = new MockPlayer('');
    const typist = new Typist(player, factory.create('あ'));
    expect(typist.score).toEqual(0);
  });

  it('Update Typist', () => {
    const input = 'aiiu';
    const player = new MockPlayer(input);
    const typist = new Typist(player, factory.create('あいう'));
    const expected = [
      [EventType.Typing, false],
      [EventType.Typing, false],
      [EventType.MissTyping, false],
      [EventType.Typing, true],
      [undefined, true],
    ];
    expected.forEach(([eventType, isEnd]) => {
      expect(typist.update()).toEqual(eventType);
      expect(typist.isEnd()).toEqual(isEnd);
    });
    expect(typist.countTotalTyping).toEqual(input.length);
    expect(typist.countMissTyping).toEqual(1);
  });
});
