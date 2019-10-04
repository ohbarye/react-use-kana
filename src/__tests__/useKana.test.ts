import { renderHook, act } from '@testing-library/react-hooks';
import { useKana } from '../useKana';

test('returns kana based on user input', () => {
  const { result } = renderHook(() => useKana());

  expect(result.current.kana).toEqual('');

  // Emulates to input a user's last name
  [
    'や',
    'やｍ',
    'やま',
    'やまｄ',
    'やまだ',
    '山田',
    '山田い',
    '山田井',
  ].forEach(value => {
    act(() => {
      result.current.setKanaSource({
        value,
      });
    });
  });

  expect(result.current.kana).toEqual('やまだい');
});
