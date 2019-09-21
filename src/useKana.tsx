import { useState } from 'react';
import historykana from 'historykana';

type History = {
  [key: string]: string[];
};

type Kana = {
  [key: string]: string;
};

type setKanaSourceArgs = {
  fieldName: string;
  inputtedValue: string;
};

const createInitialHash = <T extends string | string[]>(
  fieldNames: string[],
  defaultValue: T,
): { [key: string]: T } => {
  return fieldNames.reduce((acc: { [key: string]: T }, fieldName) => {
    acc[fieldName] = defaultValue;
    return acc;
  }, {});
};

export const useKana = (
  fieldNames: string[],
): {
  kana: Kana;
  setKanaSource: ({ fieldName, inputtedValue }: setKanaSourceArgs) => void;
} => {
  const [history, setHistory] = useState<History>(
    createInitialHash(fieldNames, []),
  );
  const [kana, setKana] = useState<Kana>(createInitialHash(fieldNames, ''));

  const setKanaSource = ({
    fieldName,
    inputtedValue,
  }: {
    fieldName: string;
    inputtedValue: string;
  }): void => {
    const newHistory = inputtedValue
      ? [...history[fieldName], inputtedValue]
      : [];
    setHistory({
      ...history,
      [fieldName]: newHistory,
    });
    setKana({
      ...kana,
      [fieldName]: historykana(newHistory),
    });
  };
  return { kana, setKanaSource };
};
