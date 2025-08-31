export enum Key {
  Up = '<up>',
  Down = '<down>',
  Left = '<left>',
  Right = '<right>',
  Enter = '<enter>',
}

export class Input {
  queue: string[];

  constructor() {
    this.queue = [];
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          this.queue.push(Key.Up);
          break;
        case 'ArrowDown':
          this.queue.push(Key.Down);
          break;
        case 'ArrowLeft':
          this.queue.push(Key.Left);
          break;
        case 'ArrowRight':
          this.queue.push(Key.Right);
          break;
        case 'Enter':
          this.queue.push(Key.Enter);
          break;
        default:
          if (e.key.length == 1) {
            this.queue.push(e.key);
          }
      }
    });
  }

  /**
   * 入力されたキーを返す
   * @returns 入力されたキー。何も入力されてなければundefined
   */
  getKey(): string | undefined {
    return this.queue.shift();
  }
}
