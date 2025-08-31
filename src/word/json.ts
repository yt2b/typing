import { Word } from './word';

export const loadWords = async (): Promise<Word[]> => {
  const data = await loadJSON('words/words.json');
  return data;
};

const loadJSON = async (file: string): Promise<Word[]> => {
  const res = await fetch(file);
  const data = await res.json();
  return data as Word[];
};
