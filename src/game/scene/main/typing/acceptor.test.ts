import { createNode } from './node';
import { createPatterns } from './patterns';
import { Chara, Result } from './acceptor';
import { AcceptorFactory } from './acceptor-factory';

const patterns = createPatterns();

describe('Chara', () => {
  test('Return consonants', () => {
    const chara = new Chara('ち', createNode(patterns['ち']));
    expect(chara.getConsonants()).toEqual(['t', 'c']);
  });
});

describe('Acceptor', () => {
  const factory = new AcceptorFactory(patterns);

  test.each([
    ['じゅよう', 'ji', 'juyou', 'jilyuyou'],
    ['きゃら', 'kix', 'kyara', 'kixyara'],
    ['たっち', 'tac', 'tatti', 'tacchi'],
    ['ばっと', 'bal', 'batto', 'baltuto'],
    ['いっきょ', 'ixts', 'ikkyo', 'ixtsukyo'],
    ['あんち', 'anc', 'anti', 'anchi'],
    ['たんご', 'tann', 'tango', 'tanngo'],
  ])('Change completion (text:%s, input:%s,  %s → %s)', (text, input, before_pred, after_pred) => {
    const acceptor = factory.create(text);
    expect(acceptor.getCompletion()).toEqual(before_pred);
    Array.from(input).forEach((ch) => acceptor.accept(ch));
    expect(acceptor.getCompletion()).toEqual(after_pred);
  });

  test.each([
    ['あいう', ['aiu']],
    ['たんご', ['tanngo', 'taxngo', 'tango']],
    ['たんい', ['tanni', 'taxni']],
    ['そんな', ['sonnna', 'soxnna']],
    ['きゅう', ['kyuu', 'kilyuu', 'kixyuu']],
    ['ばっち', ['batti', 'baltuti', 'baxtuti', 'baltsuti', 'baxtsuti']],
    ['ばっち', ['bacchi', 'baltuchi', 'baxtuchi', 'baltsuchi', 'baxtsuchi']],
  ])('Input multiple patterns (text: %s, inputs: %s)', (text, inputs) => {
    inputs.forEach((input) => {
      const acceptor = factory.create(text);
      Array.from(input).forEach((char) => {
        expect(acceptor.accept(char)).toEqual(Result.Accept);
      });
      expect(acceptor.end).toEqual(true);
    });
  });

  test.each([
    ['たん', 'tan'],
    ['たんい', 'tani'],
    ['どんな', 'donna'],
    ['よん!', 'yon!'],
  ])('Input incorrect patterns (text: %s, inputs: %s)', (text, input) => {
    const acceptor = factory.create(text);
    Array.from(input).forEach((char) => acceptor.accept(char));
    expect(acceptor.end).toEqual(false);
  });
});
