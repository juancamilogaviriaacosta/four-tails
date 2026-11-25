import { EnumConverterPipe } from './enum-converter.pipe';

describe('EnumConverterPipe', () => {
  const pipe = new EnumConverterPipe();

  it('converts pricing unit enum values to readable labels', () => {
    expect([
      pipe.transform('PER_NIGHT'),
      pipe.transform('PER_DAY'),
      pipe.transform('PER_HOUR'),
      pipe.transform('PER_SESSION'),
    ]).toEqual(['Per Night', 'Per Day', 'Per Hour', 'Per Session']);
  });

  it('returns an empty string for missing values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
