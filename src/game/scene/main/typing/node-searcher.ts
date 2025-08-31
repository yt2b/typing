import { Node } from "./node";

export class NodeSearcher {
  root: Node;
  current: Node;
  isEnd: boolean;
  history: string[];

  constructor(root: Node) {
    this.root = root;
    this.current = root;
    this.isEnd = false;
    this.history = [];
  }

  contains(char: string): boolean {
    return this.current.find(char) !== undefined;
  }

  /**
   * 現在地ノードを先へ進める
   * @param char 入力文字
   */
  step(char: string) {
    const child = this.current.find(char);
    if (child !== undefined) {
      this.current = child;
      this.isEnd = child.children === undefined;
      this.history.push(char);
    }
  }

  /**
   * 入力履歴+予測文字列を返す
   * @returns
   */
  getPrediction(): string {
    const history = this.history.join("");
    const children = this.current.children;
    const prediction =
      children === undefined ? "" : children[0].getPrediction();
    return history + prediction;
  }
}
