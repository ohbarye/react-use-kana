import { useState } from 'react';
import historykana from 'historykana';

export const useKana = (): {
  kana: string;
  setKanaSource: ({ value }: { value: string }) => void;
} => {
  const [history, setHistory] = useState<string[]>([]);
  const [kana, setKana] = useState<string>('');

  const setKanaSource = ({ value }: { value: string }): void => {
    const newHistory = value ? [...history, value] : [];
    setHistory(newHistory);
    setKana(historykana(newHistory));
  };

  return { kana, setKanaSource };
};
