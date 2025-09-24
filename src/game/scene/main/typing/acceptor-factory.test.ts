import { createNode } from './node';
import { createPatterns } from './patterns';
import { Chara, Acceptor } from './acceptor';
import { AcceptorFactory } from './acceptor-factory';

describe('AcceptorFactory', () => {
  test('Craete instance', () => {
    const patterns = createPatterns();
    const factory = new AcceptorFactory(patterns);
    const charas = [
      new Chara('きゃ', createNode(patterns['きゃ'])),
      new Chara('っ', createNode(patterns['っ'])),
      new Chara('ち', createNode(patterns['ち'])),
    ];
    const actual = factory.create('きゃっち');
    expect(actual).toEqual(new Acceptor(charas));
  });

  test('Return split array', () => {
    const factory = new AcceptorFactory(createPatterns());
    expect(factory.split('にゅうりょく')).toEqual(['にゅ', 'う', 'りょ', 'く']);
  });

  test('Get consonant', () => {
    const factory = new AcceptorFactory(createPatterns());
    expect(factory.getConsonants('あ')).toEqual([]);
    expect(factory.getConsonants('さ')).toEqual(['s']);
    expect(factory.getConsonants('ち')).toEqual(['t', 'c']);
  });
});
