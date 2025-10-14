import { Chara } from './acceptor';
import { createNode } from '../node';
import { createPatterns } from '../patterns';
import { NNRuleHandler, SmallTsuRuleHandler } from './special-rule-handler';

const patterns = createPatterns();

describe('NNRuleHandler', () => {
  const chara = new Chara('ん', createNode(patterns['ん']));

  test.each(['か', 'し', 'た', 'ふ', 'ー', '1', ',', '.', 'a'])('Return special completion (%s)', (nextChar) => {
    const handler = new NNRuleHandler();
    const nextChara = new Chara(nextChar, createNode(patterns[nextChar]));
    expect(handler.getCompletion(chara, nextChara)).toEqual('n');
  });

  test.each(['え', 'に', 'よ', 'ん', undefined])('Return normal completion (%s)', (nextChar) => {
    const handler = new NNRuleHandler();
    const nextChara = nextChar === undefined ? undefined : new Chara(nextChar, createNode(patterns[nextChar]));
    const expected = chara.node.getCompletion();
    expect(handler.getCompletion(chara, nextChara)).toEqual(expected);
  });
});

describe('SmallTsuRuleHandler', () => {
  const chara = new Chara('っ', createNode(patterns['っ']));

  test.each(['か', 'た', 'ふ', 'る'])('Return special completion (%s)', (nextChar) => {
    const handler = new SmallTsuRuleHandler();
    const nextChara = new Chara(nextChar, createNode(patterns[nextChar]));
    const expected = nextChara.getConsonants()[0];
    expect(handler.getCompletion(chara, nextChara)).toEqual(expected);
  });

  test.each(['あ', 'ぬ', 'ん', 'a', '!', undefined])('Return Normal completion (%s)', (nextChar) => {
    const handler = new SmallTsuRuleHandler();
    const nextChara = nextChar === undefined ? undefined : new Chara(nextChar, createNode(patterns[nextChar]));
    const completion = chara.node.getCompletion();
    expect(handler.getCompletion(chara, nextChara)).toEqual(completion);
  });
});
