import { createNode, Node } from './node';

describe('createNode', () => {
  test('Create instance', () => {
    const node = createNode(['ka', 'ca']);
    expect(node).toEqual(new Node('', [new Node('k', [new Node('a')]), new Node('c', [new Node('a')])]));
  });

  test('Push child node', () => {
    const node = new Node('');
    expect(node.children).toEqual(undefined);
    node.push(new Node('c'));
    expect(node.children).toEqual([new Node('c')]);
  });

  test('Return child node', () => {
    const node = createNode(['ka', 'ca']);
    expect(node.find('k')).toEqual(new Node('k', [new Node('a')]));
    expect(node.find('r')).toEqual(undefined);
  });

  test('Return completion string', () => {
    const node = createNode(['ka', 'ca']);
    expect(node.getCompletion()).toEqual('ka');
  });
});
