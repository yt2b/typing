import { Event } from '../event';
import { SceneType } from '../game';

export interface Scene {
  /**
   * 初期化処理
   * @param param パラメータ
   */
  initialize(param?: unknown): void;

  /**
   * ゲームの状態を更新する
   * @param key キー入力
   */
  update(key?: string): { sceneType: SceneType; events: Event[]; param?: unknown };
}
