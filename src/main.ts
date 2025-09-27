import { Game } from './game/game';
import { Input } from './input/input';
import { Renderer } from './renderer/renderer';
import { loadWords } from './word/json';
import { Audio } from './audio/audio';

window.addEventListener('load', async () => {
  const words = await loadWords();
  const input = new Input();
  const game = new Game(words);
  const renderer = new Renderer(document.getElementById('canvas') as HTMLCanvasElement);
  const audio = new Audio();
  await audio.load();
  const run = (_: number) => {
    game.update(input.getKey());
    const events = game.getEvents();
    renderer.handle_events(game.sceneType, events);
    renderer.render(game.sceneType, game.getScene());
    audio.handle_events(events);
    window.requestAnimationFrame(run);
  };
  window.requestAnimationFrame(run);
});
