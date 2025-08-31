import { Event } from '../../game/event';
import { Scene as GameScene } from '../../game/scene/scene';

export interface Scene {
  /**
   * 初期化する
   */
  initialize(): void;
  /**
   * イベントに対応する
   * @param events ゲームイベントの配列
   */
  handle_events(events: Event[]): void;
  /**
   * 描画する
   * @param game ゲームロジック
   */
  render(scene: GameScene): void;
}
