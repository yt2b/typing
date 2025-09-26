import { AcceptorFactory } from '../typing/acceptor/acceptor-factory';
import { Word } from '../../../../word/word';
import { Typist } from './typist';
import { Player } from '../player/player';
import { EventType, Event } from '../../../event';

export class TypistManager {
  words: Word[];
  currentWord: Word;
  nextWord: Word;
  factory: AcceptorFactory;
  typists: Typist[] = [];

  constructor(words: Word[], factory: AcceptorFactory, players: Player[]) {
    this.words = words;
    this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
    this.nextWord = this.words[Math.floor(Math.random() * this.words.length)];
    this.factory = factory;
    this.setPlayers(players);
  }

  /**
   * プレイヤーを設定する
   * @param players プレイヤーの配列
   */
  setPlayers(players: Player[]) {
    this.typists = players.map((player) => new Typist(player, this.factory.create(this.currentWord.inputText)));
  }

  /**
   * 次のワードを設定する
   */
  setNextText() {
    this.currentWord = this.nextWord;
    this.nextWord = this.words[Math.floor(Math.random() * this.words.length)];
    for (const typist of this.typists) {
      typist.setAcceptor(this.factory.create(this.currentWord.inputText));
    }
  }

  /**
   * 状態を更新する
   * @returns ゲームイベントの配列
   */
  update(): Event[] {
    const events: Event[] = [];
    this.typists.forEach((typist, idx) => {
      const type = typist.update();
      if (type !== undefined) {
        events.push({ type: type, payload: { idx: idx } });
      }
    });
    // テキストの入力が完了したプレイヤーを探す
    const idx = this.typists.findIndex((typist) => typist.isEnd());
    if (idx != -1) {
      // 完了したプレイヤーにスコアを加算
      this.typists[idx].score += 1;
      this.setNextText();
      events.push({ type: EventType.Completed, payload: { idx: idx, isPerfect: false } });
    }
    return events;
  }
}
