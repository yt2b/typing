import { Acceptor, Chara, Result } from './acceptor';
import { NodeSearcher } from '../node-searcher';

/**
 * 特殊な平仮名のルールを扱うインターフェース
 */
export interface SpecialRuleHandler {
  /**
   * 入力文字を受け入れる
   * @param acceptor 入力を受け入れるオブジェクト
   * @param char 入力文字
   * @return 入力結果
   */
  accept(acceptor: Acceptor, char: string): Result;
  /**
   * 予測文字列を返す
   * @param chara 文字
   * @param nextChara charaに次に来る文字
   */
  getCompletion(chara: Chara, nextChara: Chara | undefined): string;
  /**
   * 現在の予測文字列を返す
   * @param searcher 現在入力中の文字のNodeSearcher
   * @param nextChara 次に来る文字
   */
  getCurrentCompletion(searcher: NodeSearcher, nextChara: Chara | undefined): string;
}

/**
 * 「ん」のルールを扱うクラス
 */
export class NNRuleHandler implements SpecialRuleHandler {
  acceptable: boolean = false;

  accept(acceptor: Acceptor, char: string): Result {
    if (this.acceptable) {
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
      // 1. 現在「n」が1回だけ入力されている
      // 2. 次に入力する文字が存在する
      // 3. 次に入力する文字があ行、な行、や行、「ん」以外の平仮名
      const history = acceptor.searcher.history;
      const validateHistory = history.length == 1 && history[0] == 'n';
      const idx = acceptor.idx;
      const validateNextChar = this.validate(acceptor.charas[idx], acceptor.charas[idx + 1]);
      this.acceptable = validateHistory && validateNextChar;
    }
    return result;
  }

  getCompletion(chara: Chara, nextChara: Chara | undefined): string {
    if (nextChara === undefined || !this.validate(chara, nextChara)) {
      return chara.node.getCompletion();
    }
    return 'n';
  }

  getCurrentCompletion(searcher: NodeSearcher, nextChara: Chara | undefined): string {
    if (nextChara === undefined || /[あ-おな-のやゆよんーa-z0-9!?,.[\]]/.test(nextChara.value)) {
      return searcher.getCompletion();
    }
    if (searcher.history.length == 0 || (searcher.history.length == 1 && searcher.history[0] == 'n')) {
      return 'n';
    }
    return searcher.getCompletion();
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
}

/**
 * 「っ」のルールを扱うクラス
 */
export class SmallTsuRuleHandler implements SpecialRuleHandler {
  accept(acceptor: Acceptor, char: string): Result {
    if (acceptor.step(char) == Result.Accept) {
      return Result.Accept;
    }
    // 次に来る文字を判定する
    const nextChara = acceptor.charas[acceptor.idx + 1];
    if (nextChara === undefined || /[あ-おな-のんーa-z0-9!?,.[\]]/.test(nextChara.value)) {
      return Result.Reject;
    }
    const historyLength = acceptor.searcher.history.length;
    const consonants = nextChara.getConsonants();
    // 「っ」を次の文字の子音で入力可能か判定する
    if (historyLength <= 1 && consonants.find((c) => c == char)) {
      acceptor.history += char;
      acceptor.next();
      if (historyLength == 1) {
        acceptor.step(char);
      }
      // 次の文字の予測を変更する
      const chara = acceptor.charas[acceptor.idx];
      const consonants = chara.getConsonants();
      const i = consonants.findIndex((consonant) => consonant == char);
      if (i > 0 && chara.node.children !== undefined) {
        // ノードの順番を変更する
        const child = chara.node.children.splice(i, 1);
        chara.node.children.unshift(...child);
      }
      acceptor.updateCompletion();
      return Result.Accept;
    }
    return Result.Reject;
  }

  getCompletion(chara: Chara, nextChara: Chara | undefined): string {
    if (nextChara === undefined || /[あ-おな-のんーa-z0-9!?,.[\]]/.test(nextChara.value)) {
      return chara.node.getCompletion();
    }
    return nextChara.getConsonants()[0];
  }

  getCurrentCompletion(searcher: NodeSearcher, nextChara: Chara | undefined): string {
    if (nextChara === undefined || /[あ-おな-のんーa-z0-9!?,.[\]]/.test(nextChara.value)) {
      return searcher.getCompletion();
    }
    if (searcher.history.length == 0) {
      return nextChara.getConsonants()[0];
    }
    return searcher.getCompletion();
  }
}
