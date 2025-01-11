import { OnlySudokuDigitsPipe } from './only-sudoku-digits.pipe';

describe('OnlySudokuDigitsPipe', () => {
  it('create an instance', () => {
    const pipe = new OnlySudokuDigitsPipe();
    expect(pipe).toBeTruthy();
  });
});
