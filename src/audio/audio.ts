import { Event, EventType } from '../game/event';

export class Audio {
  sources: Record<string, AudioBuffer> = {};
  context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }

  async load() {
    const names = ['select', 'decision'];
    names.forEach(async (name) => {
      const res = await fetch(`assets/audio/${name}.mp3`);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.sources[name] = audioBuffer;
    });
  }

  play(name: string) {
    const source = this.context.createBufferSource();
    source.buffer = this.sources[name];
    source.connect(this.context.destination);
    source.start(0);
  }

  handle_events(events: Event[]) {
    events.forEach((event) => {
      switch (event.type) {
        case EventType.Select:
          this.play('select');
          break;
        case EventType.Decision:
          this.play('decision');
          break;
        case EventType.Start:
          this.play('decision');
          break;
        case EventType.Typing:
          break;
        case EventType.MissTyping:
          break;
        case EventType.Completed:
          break;
      }
    });
  }
}
