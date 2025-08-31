export interface Player {
  /**
   * プレイヤーが入力するテキストを設定する
   * @param text アルファベットの入力テキスト
   */
  setText(text: string): void;

  /**
   * 入力したキーを返す
   */
  getKey(): string | undefined;
}
