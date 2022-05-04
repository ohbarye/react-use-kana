import { act, renderHook } from '@testing-library/react-hooks';
import { describe, expect, test } from 'vitest';
import { useKana } from '../useKana';

describe('basic functionality', () => {
  // What's the No.?
  // Conversion pattern: See details in https://docs.google.com/spreadsheets/d/13kMl3XQ2SG9BQTYaP-lUeVPu5I6u7Xi8Gw3H6ErYqyM/edit?usp=sharing

  // No. 8
  describe('when several kanas are converted to kanjis at once', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['や', 'やｍ', 'やま', 'やまｄ', 'やまだ', '山田'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('やまだ');
    });
  });

  describe('remove and invalid value after kana converted', () => {
    test('return empty', () => {
      const { result } = renderHook(() => useKana());
      expect(result.current.kana).toEqual('');
      ['や', 'やｍ', 'やま', 'やまｄ', 'やまだ', '山田', '', 'a'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('');
    });
  });

  // No. 14
  describe('when kanas are converted to kanjis one by one', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['や', 'やｍ', 'やま', '山', '山ｄ', '山だ', '山田'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('やまだ');
    });

    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['や', 'やｍ', 'やま', '山', '山ｄ', '山だ', '山だｎ', '山だな', '山だ名', '山田名'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('やまだな');
    });
  });

  // No. 7
  describe('when kanas are converted to kanjis via some kanjis', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['や', 'やｍ', 'やま', '山', '山ｄ', '山だ', '山駄', '山打', '山田'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('やまだ');
    });
  });

  // No. 8
  describe('when kanas are converted to katakana', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['ｋ', 'く', 'くｒ', 'くり', 'くりｓ', 'くりす', 'クリス'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('くりす');
    });
  });

  // No. 14
  describe('when conversion happened from head', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['ｄ', 'だ', '田', 'い田', 'いい田', '飯田'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('いいだ');
    });
  });

  // No. 14
  describe('when a full-width space between characters is given', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['ｒ', 'り', '李', '李', '李　', '李　あ', '李　あい', '李　愛'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('り　あい');
    });
  });

  // No. 14
  describe('when a half-width space between characters is given', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['ｒ', 'り', '李', '李', '李 ', '李 あ', '李 あい', '李 愛'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('り あい');
    });
  });

  // No. 14
  describe('when a half-width space between characters is given', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['ｒ', 'り', '李', '李', '李 ', '李  ', '李  あ', '李  あい', '李  愛'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('り  あい');
    });
  });

  // No. 13
  describe('when converted to strings with kana and non-kana both', () => {
    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['あ', 'あい', 'あいう', '亜い卯'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('あいう');
    });

    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['あ', 'あい', 'あいう', 'あ位う'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('あいう');
    });

    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['あ', 'あい', '亜い'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('あい');
    });

    test('returns kana based on user input', () => {
      const { result } = renderHook(() => useKana());

      expect(result.current.kana).toEqual('');
      ['あ', 'あい', 'あ位'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('あい');
    });
  });
});

describe('katakana mode', () => {
  describe('set kanaType as katakana', () => {
    test('returns katakana based on user input', () => {
      const { result } = renderHook(() => useKana({ kanaType: 'katakana' }));

      expect(result.current.kana).toEqual('');
      ['ｒ', 'り', '李', '李', '李 ', '李  ', '李  あ', '李  あい', '李  愛'].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual('リ  アイ');
    });

    test('it converts all hiragana to katakana', () => {
      const { result } = renderHook(() => useKana({ kanaType: 'katakana' }));

      expect(result.current.kana).toEqual('');
      [
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょわ゙ゐ゙ゔゑ゙を゙',
      ].forEach((value) => {
        act(() => {
          result.current.setKanaSource(value);
        });
      });
      expect(result.current.kana).toEqual(
        'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォッャュョヷヸヴヹヺ',
      );
    });
  });
});
