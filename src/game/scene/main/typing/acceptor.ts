import { Node } from './node';
import { NodeSearcher } from './node-searcher';
import { NNRuleHandler, SmallTsuRuleHandler, SpecialRuleHandler } from './special-rule-handler';

export enum Result {
  Accept,
  Reject,
}

export class Acceptor {
  idx: number = 0;
  count: number = 0;
  history: string = '';
  end: boolean = false;
  charas: Chara[];
  searcher: NodeSearcher;
  specialRuleHandlers: Record<string, SpecialRuleHandler>;

  constructor(charas: Chara[]) {
    this.charas = charas;
    this.searcher = new NodeSearcher(this.charas[0].node);
    this.specialRuleHandlers = { ん: new NNRuleHandler(), っ: new SmallTsuRuleHandler() };
  }

  /**
   * 入力文字を受け入れる
   * @param char 入力文字
   * @return 入力結果
   */
  accept(char: string): Result {
    const chara = this.charas[this.idx];
    const handler = this.specialRuleHandlers[chara.value];
    if (handler === undefined) {
      return this.step(char);
    } else {
      return handler.accept(this, char);
    }
  }

  /**
   * 入力文字を1文字進める
   * @param char 入力文字
   * @return 入力結果
   */
  step(char: string): Result {
    if (!this.searcher.contains(char)) {
      return Result.Reject;
    }
    this.searcher.step(char);
    this.count += 1;
    this.history += char;
    if (this.searcher.isEnd) {
      if (this.charas[this.idx + 1] === undefined) {
        // 全ての文字を入力した
        this.end = true;
      } else {
        // 次の文字に進む
        this.next();
      }
    }
    return Result.Accept;
  }

  /**
   * 次の文字に進む
   */
  next() {
    this.idx += 1;
    this.count = 0;
    this.searcher = new NodeSearcher(this.charas[this.idx].node);
  }

  /**
   * 入力文字全体の予測を返す
   * @returns
   */
  getCompletion(): string {
    const nnRuleHandler = this.specialRuleHandlers['ん'] as NNRuleHandler;
    // 入力履歴
    const history = this.history.substring(0, this.history.length - this.count);
    // 現在入力中の文字
    const current = nnRuleHandler.validate(this.charas[this.idx], this.charas[this.idx + 1])
      ? nnRuleHandler.getCurrentCompletion(this.searcher)
      : this.searcher.getCompletion();
    // 未入力文字の予測
    const completion = this.charas
      .slice(this.idx + 1)
      .map((chara, i) => {
        const handler = this.specialRuleHandlers[chara.value];
        if (handler === undefined) {
          return chara.node.getCompletion();
        } else {
          return handler.getCompletion(chara, this.charas[this.idx + i + 2]);
        }
      })
      .reduce((buf, completion) => buf + completion, '');
    return history + current + completion;
  }
}

/**
 * 文字を表すクラス
 */
export class Chara {
  value: string;
  node: Node;

  constructor(value: string, node: Node) {
    this.value = value;
    this.node = node;
  }

  /**
   * 子音を返す
   * @returns 子音の配列 (あ行の平仮名または平仮名以外の場合は空配列)
   */
  getConsonants(): string[] {
    if (/[あ-おーa-z0-9!?,.[\]]/.test(this.value) || this.node.children === undefined) {
      return [];
    }
    return this.node.children.map((child) => child.char);
  }
}
