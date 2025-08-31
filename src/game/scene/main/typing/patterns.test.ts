import { createMultiPattern } from './patterns';

describe('createMultiPattern', () => {
  test('Return empty array', () => {
    expect(createMultiPattern('')).toEqual([]);
  });

  test('Return multi pattern array', () => {
    expect(createMultiPattern('しゃ')).toEqual(['silya', 'sixya', 'shilya', 'shixya', 'cilya', 'cixya']);
  });
});
