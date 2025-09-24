import { Node } from './node';
import { NodeSearcher } from './node-searcher';

export enum Result {
  Accept,
  Reject,
}

export class Acceptor {
  idx: number = 0;
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
    this.history += this.searcher.history.join('');
    this.searcher = new NodeSearcher(this.charas[this.idx].node);
  }

  /**
   * 入力文字全体の予測を返す
   * @returns
   */
  getCompletion(): string {
    const nnRuleHandler = this.specialRuleHandlers['ん'] as NNRuleHandler;
    const smallTsuRuleHandler = this.specialRuleHandlers['っ'] as SmallTsuRuleHandler;
    // 現在入力中の文字
    const current = nnRuleHandler.validate(this.charas[this.idx], this.charas[this.idx + 1])
      ? nnRuleHandler.getCompletion(this.searcher)
      : this.searcher.getCompletion();
    // 未入力文字の予測
    const completion = this.charas
      .slice(this.idx + 1)
      .map((chara, i) => {
        switch (chara.value) {
          case 'ん':
            return nnRuleHandler.getCompletion(this.searcher);
          case 'っ':
            return smallTsuRuleHandler.getCompletion(this.searcher, this.charas[this.idx + 2 + i]);
          default:
            return chara.node.getCompletion();
        }
      })
      .reduce((buf, completion) => buf + completion, '');
    return this.history + current + completion;
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

/**
 * 特殊な平仮名のルールを扱うインターフェース
 */
interface SpecialRuleHandler {
  /**
   * 現在の文字に適用可能なルールかを判定する
   * @param chara 現在の文字
   */
  applicable(chara: Chara): boolean;
  /**
   * 入力文字を受け入れる
   * @param acceptor 入力を受け入れるオブジェクト
   * @param char 入力文字
   * @return 入力結果
   */
  accept(acceptor: Acceptor, char: string): Result;
}

/**
 * 「ん」のルールを扱うクラス
 */
class NNRuleHandler implements SpecialRuleHandler {
  acceptable: boolean = false;

  applicable(chara: Chara): boolean {
    return chara.value == 'ん';
  }

  accept(acceptor: Acceptor, char: string): Result {
    if (char != 'n' && this.acceptable) {
      // charと次に来る文字の子音のいずれかが一致していたら次の文字に進む
      const consonants = acceptor.charas[acceptor.idx + 1].getConsonants();
      if (consonants.find((c) => c == char)) {
        this.acceptable = false;
        acceptor.next();
      }
    }
    const result = acceptor.step(char);
    if (result == Result.Accept) {
      // acceptableフラグが立つのは以下の条件を全て満たす場合
      // 1. 現在の文字が「ん」であり
      // 2. 現在「n」が1回だけ入力されている
      // 3. 次に入力する文字が存在する
      // 4. 次に入力する文字があ行、な行、や行、「ん」以外の平仮名
      const history = acceptor.searcher.history;
      const validateHistory = history.length == 1 && history[0] == 'n';
      const idx = acceptor.idx;
      const validateNextChar = this.validate(acceptor.charas[idx], acceptor.charas[idx + 1]);
      this.acceptable = validateHistory && validateNextChar;
    }
    return result;
  }

  /**
   * 指定した文字が1回のnで入力できるかの判定処理
   * @param chara 現在の文字
   * @param nextChara charaの次に来る文字
   * @returns
   */
  validate(chara: Chara, nextChara: Chara | undefined): boolean {
    if (chara.value == 'ん' && nextChara !== undefined) {
      return !/[あ-おな-のやゆよんーa-z0-9!?,.[\]]/.test(nextChara.value);
    }
    return false;
  }

  /**
   * 「ん」の予測文字列を返す
   * @param searcher NodeSearcher
   * @returns
   */
  getCompletion(searcher: NodeSearcher): string {
    const history = searcher.history;
    if (history.length == 0 || (history.length == 1 && history[0] == 'n')) {
      return 'n';
    }
    return searcher.getCompletion();
  }
}

/**
 * 「っ」のルールを扱うクラス
 */
class SmallTsuRuleHandler implements SpecialRuleHandler {
  applicable(chara: Chara): boolean {
    return chara.value == 'っ';
  }

  accept(acceptor: Acceptor, char: string): Result {
    const nextChara = acceptor.charas[acceptor.idx + 1];
    if (nextChara === undefined) {
      return acceptor.step(char);
    }
    const consonants = nextChara.getConsonants();
    // 「っ」を次の文字の子音で入力可能かの判定
    if (acceptor.searcher.history.length == 0 && char != 'n' && consonants.find((c) => c == char)) {
      acceptor.history += char;
      acceptor.next();
      // 次の文字の予測を変更する
      const chara = acceptor.charas[acceptor.idx];
      const consonants = chara.getConsonants();
      const i = consonants.findIndex((consonant) => consonant == char);
      if (i > 0 && chara.node.children !== undefined) {
        // ノードの順番を変更する
        const child = chara.node.children.splice(i, 1);
        chara.node.children.unshift(...child);
      }
      return Result.Accept;
    } else {
      return acceptor.step(char);
    }
  }

  validate(chara: Chara, nextChara: Chara | undefined): boolean {
    if (chara.value == 'っ' && nextChara !== undefined) {
      return !/[あ-おな-のんーa-z0-9!?,.[\]]/.test(nextChara.value);
    }
    return false;
  }

  /**
   * 「っ」の予測文字列を返す
   * @param searcher NodeSearcher
   * @returns
   */
  getCompletion(searcher: NodeSearcher, nextChara: Chara | undefined): string {
    if (nextChara === undefined) {
      return searcher.getCompletion();
    }
    if (!/[あ-おな-のんーa-z0-9!?,.[\]]/.test(nextChara.value)) {
      const consonants = nextChara.getConsonants();
      return consonants[0];
    }
    return searcher.getCompletion();
  }
}
