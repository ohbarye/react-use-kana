import { renderHook, act } from '@testing-library/react-hooks';
import { useKana } from '../useKana';

describe('when several kanas are converted to kanjis at once', () => {
  it('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['や', 'やｍ', 'やま', 'やまｄ', 'やまだ', '山田'].forEach(value => {
      act(() => {
        result.current.setKanaSource(value);
      });
    });
    expect(result.current.kana).toEqual('やまだ');
  });
});

describe('when kanas are converted to kanjis one by one', () => {
  test('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['や', 'やｍ', 'やま', '山', '山ｄ', '山だ', '山田'].forEach(value => {
      act(() => {
        result.current.setKanaSource(value);
      });
    });
    expect(result.current.kana).toEqual('やまだ');
  });
});

describe('when kanas are converted to kanjis one by one', () => {
  // TODO Fix a bug
  test.skip('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['や', 'やｍ', 'やま', '山', '山ｄ', '山だ', '山田', '山打'].forEach(
      value => {
        act(() => {
          result.current.setKanaSource(value);
        });
      },
    );
    expect(result.current.kana).toEqual('やまだ');
  });
});

describe('when kanas are converted to katakana', () => {
  test('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['ｋ', 'く', 'くｒ', 'くり', 'くりｓ', 'くりす', 'クリス'].forEach(
      value => {
        act(() => {
          result.current.setKanaSource(value);
        });
      },
    );
    expect(result.current.kana).toEqual('くりす');
  });
});

describe('when conversion happened from head', () => {
  test('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['ｄ', 'だ', '田', 'い田', 'いい田', '飯田'].forEach(value => {
      act(() => {
        result.current.setKanaSource(value);
      });
    });
    expect(result.current.kana).toEqual('いいだ');
  });
});

describe('when a full-width space between characters is given', () => {
  test('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['ｒ', 'り', '李', '李', '李　', '李　あ', '李　あい', '李　愛'].forEach(
      value => {
        act(() => {
          result.current.setKanaSource(value);
        });
      },
    );
    expect(result.current.kana).toEqual('り　あい');
  });
});

describe('when a half-width space between characters is given', () => {
  test('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    ['ｒ', 'り', '李', '李', '李 ', '李 あ', '李 あい', '李 愛'].forEach(
      value => {
        act(() => {
          result.current.setKanaSource(value);
        });
      },
    );
    expect(result.current.kana).toEqual('り あい');
  });
});

describe('when a half-width space between characters is given', () => {
  test('returns kana based on user input', () => {
    const { result } = renderHook(() => useKana());

    expect(result.current.kana).toEqual('');
    [
      'ｒ',
      'り',
      '李',
      '李',
      '李 ',
      '李  ',
      '李  あ',
      '李  あい',
      '李  愛',
    ].forEach(value => {
      act(() => {
        result.current.setKanaSource(value);
      });
    });
    expect(result.current.kana).toEqual('り  あい');
  });
});
