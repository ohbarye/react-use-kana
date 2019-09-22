import { renderHook, act } from '@testing-library/react-hooks';
import { useKana } from '../useKana';

test('returns kana based on user input', () => {
  const { result } = renderHook(() =>
    useKana(['lastNameKana', 'firstNameKana']),
  );

  expect(result.current.kana).toEqual({
    lastNameKana: '',
    firstNameKana: '',
  });

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
        fieldName: 'lastNameKana',
        inputtedValue: value,
      });
    });
  });

  expect(result.current.kana).toEqual({
    lastNameKana: 'やまだい',
    firstNameKana: '',
  });

  // Emulates to input a user's first name
  [
    'け',
    'けｎ',
    'けんｔ',
    'けんた',
    'けんたｒ',
    'けんたろ',
    'けんたろう',
    '健太郎',
  ].forEach(value => {
    act(() => {
      result.current.setKanaSource({
        fieldName: 'firstNameKana',
        inputtedValue: value,
      });
    });
  });

  expect(result.current.kana).toEqual({
    lastNameKana: 'やまだい',
    firstNameKana: 'けんたろう',
  });
});
