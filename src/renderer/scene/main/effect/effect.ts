export interface Effect {
  /**
   * 生存フラグが立っているか
   */
  isAlive(): boolean;

  /**
   * 描画する
   */
  draw(): void;
}
