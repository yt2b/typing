import { createNode } from './node';
import { NodeSearcher } from './node-searcher';

describe('NodeSearcher', () => {
  test('Create instance', () => {
    const node = createNode(['ka', 'ca']);
    const searcher = new NodeSearcher(node);
    expect(searcher.current).toEqual(node);
    expect(searcher.isEnd).toEqual(false);
    expect(searcher.history).toEqual([]);
    expect(searcher.getCompletion()).toEqual('ka');
  });

  test('Traverse child node', () => {
    const node = createNode(['kya', 'kilya', 'kixya']);
    const searcher = new NodeSearcher(node);
    const inputs = 'kitxya';
    const nodeK = node.find('k')!;
    const nodeI = nodeK.find('i')!;
    const nodeX = nodeI.find('x')!;
    const nodeY = nodeX.find('y')!;
    const nodeA = nodeY.find('a')!;
    const expected = [
      {
        contains: true,
        current: nodeK,
        isEnd: false,
        history: 'k',
        prediction: 'kya',
      },
      {
        contains: true,
        current: nodeI,
        isEnd: false,
        history: 'ki',
        prediction: 'kilya',
      },
      {
        contains: false,
        current: nodeI,
        isEnd: false,
        history: 'ki',
        prediction: 'kilya',
      },
      {
        contains: true,
        current: nodeX,
        isEnd: false,
        history: 'kix',
        prediction: 'kixya',
      },
      {
        contains: true,
        current: nodeY,
        isEnd: false,
        history: 'kixy',
        prediction: 'kixya',
      },
      {
        contains: true,
        current: nodeA,
        isEnd: true,
        history: 'kixya',
        prediction: 'kixya',
      },
    ];
    Array.from(inputs).forEach((char, idx) => {
      const { current, isEnd, history, contains, prediction } = expected[idx];
      expect(searcher.contains(char)).toEqual(contains);
      searcher.step(char);
      expect(searcher.current).toEqual(current);
      expect(searcher.isEnd).toEqual(isEnd);
      expect(searcher.history).toEqual(history.split(''));
      expect(searcher.getCompletion()).toEqual(prediction);
    });
  });
});
