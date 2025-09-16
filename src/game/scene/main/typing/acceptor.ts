import { Node } from './node';
import { NodeSearcher } from './node-searcher';

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

export class Acceptor {
  charas: Chara[];
  idx: number;
  count: number;
  history: string;
  end: boolean;
  acceptN1: boolean;
  existsNextChara: boolean;
  searcher: NodeSearcher;

  constructor(charas: Chara[]) {
    this.charas = charas;
    this.idx = 0;
    this.count = 0;
    this.history = '';
    this.existsNextChara = this.idx < this.charas.length - 1;
    this.end = false;
    this.acceptN1 = false;
    this.searcher = new NodeSearcher(this.charas[0].node);
  }

  /**
   * 入力文字が受け入れ可能かどうかを判定する
   * @param char 入力文字
   * @returns 受け入れ可能な場合はtrue、そうでない場合はfalse
   */
  acceptable(char: string): boolean {
    switch (this.charas[this.idx].value) {
      case 'ん':
        // 「ん」を1回のnで入力できるかの判定処理
        if (char != 'n' && this.acceptN1) {
          // charと次に来る文字の子音のいずれかが一致していたら次の文字に進む
          const consonants = this.charas[this.idx + 1].getConsonants();
          return consonants.find((c) => c == char) !== undefined;
        }
        return this.searcher.contains(char);
      default:
        return this.searcher.contains(char);
    }
  }

  /**
   * 入力文字を受け入れる
   * @param char 入力文字
   */
  accept(char: string) {
    switch (this.charas[this.idx].value) {
      case 'っ':
        {
          const prevIdx = this.idx;
          this.step(char);
          // 次の文字に進んだ場合
          if (this.idx > prevIdx) {
            // 次の文字の予測を変更する
            const chara = this.charas[this.idx];
            const consonants = chara.getConsonants();
            const i = consonants.findIndex((consonant) => consonant == char);
            if (i > 0 && chara.node.children !== undefined) {
              // ノードの順番を変更する
              const child = chara.node.children.splice(i, 1);
              chara.node.children.unshift(...child);
            }
          }
        }
        break;
      case 'ん':
        if (char != 'n' && this.acceptN1) {
          // charと次に来る文字の子音のいずれかが一致していたら次の文字に進む
          const consonants = this.charas[this.idx + 1].getConsonants();
          if (consonants.find((c) => c == char)) {
            this.next();
          }
        }
        this.step(char);
        break;
      default:
        this.step(char);
    }
  }

  /**
   * 入力文字を1文字進める
   * @param char 入力文字
   */
  step(char: string) {
    if (this.searcher.contains(char)) {
      this.searcher.step(char);
      this.count += 1;
      this.history += char;
    }
    if (this.searcher.isEnd) {
      if (this.existsNextChara) {
        // 次の文字に進む
        this.next();
      } else {
        // 全ての文字を入力した
        this.end = true;
      }
    } else {
      this.updateAcceptN1Flag();
    }
  }

  /**
   * acceptN1フラグの更新処理
   */
  updateAcceptN1Flag() {
    this.acceptN1 = false;
    // このフラグが立つのは以下の条件を全て満たす場合
    // 1. 現在の文字が「ん」であり
    // 2. 現在「n」が1回だけ入力されている
    // 3. 次に入力する文字が存在する
    // 4. 次に入力する文字があ行、な行、や行、「ん」以外の平仮名
    if (this.searcher.history.length == 1 && this.searcher.history[0] == 'n' && this.isAcceptableN1(this.idx)) {
      this.acceptN1 = true;
    }
  }

  /**
   * 次の文字に進む
   */
  next() {
    this.idx += 1;
    this.count = 0;
    this.existsNextChara = this.idx < this.charas.length - 1;
    this.searcher = new NodeSearcher(this.charas[this.idx].node);
  }

  /**
   * 入力文字全体の予測を返す
   * @returns
   */
  getCompletion(): string {
    // 入力履歴
    const history = this.history.substring(0, this.history.length - this.count);
    // 現在入力中の文字
    const current = this.isAcceptableN1(this.idx) ? 'n' : this.searcher.getCompletion();
    // 未入力文字の予測
    const completion = this.charas
      .slice(this.idx + 1)
      .map((chara, i) => {
        // 「ん」が1回のnで入力できるなら'n'を返す
        if (this.isAcceptableN1(this.idx + 1 + i)) {
          return 'n';
        }
        return chara.node.getCompletion();
      })
      .reduce((buf, completion) => buf + completion, '');
    return history + current + completion;
  }

  /**
   * 指定した文字が1回のnで入力できるかの判定処理
   * @param idx
   * @returns
   */
  isAcceptableN1(idx: number): boolean {
    const chara = this.charas[idx];
    const nextIdx = idx + 1;
    if (chara.value == 'ん' && nextIdx < this.charas.length) {
      const nextChara = this.charas[nextIdx];
      return !/[あ-おな-のんーa-z0-9!?,.[\]]/.test(nextChara.value);
    }
    return false;
  }
}
