import { Acceptor, Chara } from './acceptor';
import { createNode } from './node';

export class AcceptorFactory {
  patterns: Record<string, string[]>;

  constructor(patterns: Record<string, string[]>) {
    this.patterns = patterns;
  }

  /**
   * 平仮名のテキストを基にAcceptorを生成する
   * @param text 平仮名のテキスト
   * @returns Acceptor
   */
  create(text: string): Acceptor {
    const splitText = this.split(text);
    const charas: Chara[] = [];
    splitText.forEach((char) => {
      const node = createNode(this.patterns[char]);
      charas.push(new Chara(char, node));
    });
    return new Acceptor(charas);
  }

  /**
   * 平仮名のテキストを入力パターンごとに分割する
   * @param text 平仮名のテキスト
   * @returns 分割したテキスト
   */
  split(text: string): string[] {
    const ary = [];
    let buf = '';
    for (let i = 0; i < text.length - 1; i++) {
      buf = buf + text.charAt(i);
      if (!(buf + text.charAt(i + 1) in this.patterns)) {
        ary.push(buf);
        buf = '';
      }
    }
    ary.push(buf + text.charAt(text.length - 1));
    return ary;
  }

  /**
   * 子音を取得する
   * @param char 入力文字
   * @returns 子音 (あ行と「ん」の場合は空配列)
   */
  getConsonants(char: string): string[] {
    switch (char) {
      case 'あ':
      case 'い':
      case 'う':
      case 'え':
      case 'お':
      case 'ん':
        return [];
      default:
        return this.patterns[char].map((pattern) => pattern.charAt(0));
    }
  }
}
