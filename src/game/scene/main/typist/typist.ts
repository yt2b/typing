import { EventType } from '../../../event';
import { Player } from '../player/player';
import { Acceptor } from '../typing/acceptor';

export class Typist {
  player: Player;
  acceptor: Acceptor;
  score: number = 0;
  countTotalTyping: number = 0;
  countMissTyping: number = 0;

  constructor(player: Player, acceptor: Acceptor) {
    this.player = player;
    this.acceptor = acceptor;
    this.player.setText(acceptor.getPrediction());
  }

  /**
   * 新しいアクセプターを設定する
   * @param acceptor アクセプター
   */
  setAcceptor(acceptor: Acceptor) {
    this.acceptor = acceptor;
    this.player.setText(acceptor.getPrediction());
  }

  /**
   * 更新する
   * @returns 入力イベントのタイプ
   */
  update(): EventType | undefined {
    const char = this.player.getKey();
    // 入力がない
    if (char === undefined) {
      return undefined;
    }
    this.countTotalTyping++;
    if (this.acceptor.acceptable(char)) {
      // 入力成功
      this.acceptor.accept(char);
      return EventType.Typing;
    } else {
      // 入力ミス
      this.countMissTyping++;
      return EventType.MissTyping;
    }
  }

  /**
   * 入力が完了したか
   * @returns 入力が完了したならtrue
   */
  isEnd() {
    return this.acceptor.end;
  }
}
