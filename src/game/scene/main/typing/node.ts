/**
 * 入力文字列からノードを作成する
 * @param inputs 入力文字列
 * @returns ノード
 */
export const createNode = (inputs: string[]): Node => {
  const root = new Node('', []);
  for (const input of inputs) {
    let node = root;
    // 1つずつノードを進めていき、見つからなければ新しいノードを追加する
    Array.from(input).forEach((char) => {
      const child = node.find(char);
      if (child === undefined) {
        // 新しいノードを追加して進める
        const newChild = new Node(char);
        node.push(newChild);
        node = newChild;
      } else {
        // ノードを追加せずに進める
        node = child;
      }
    });
  }
  return root;
};

export class Node {
  char: string;
  children?: Node[];

  constructor(char: string, children?: Node[]) {
    this.char = char;
    this.children = children;
  }

  /**
   * ノードを追加する
   * @param child ノード
   */
  push(child: Node) {
    if (this.children === undefined) {
      this.children = [];
    }
    this.children.push(child);
  }

  /**
   * 指定した値を持つノードを返す
   * @param char
   * @returns 指定した値を持つノード。なければundefined
   */
  find(char: string): Node | undefined {
    return this.children?.find((child: Node) => child.char === char);
  }

  /**
   * 予測文字列を返す
   * @returns 予測文字列
   */
  getCompletion(): string {
    const children = this.children;
    return this.char + (children === undefined ? '' : children[0].getCompletion());
  }
}
