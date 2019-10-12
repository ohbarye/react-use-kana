import { useState } from 'react';

interface KanaMap {
  [key: string]: string;
}

interface Diff {
  added: string[];
  removed: string[];
}

interface KanaPair {
  nonKana: string;
  kana: string;
}

const KANA_REGEX = /([ 　ぁあ-んー]+)/g;
const NON_KANA_REGEX = /([^ 　ぁあ-んー]+)/g;
const SPACE_REGEX = /([ 　]+)/g;

const isKana = (value: string): boolean => !!value.match(KANA_REGEX);
const isNonKana = (value: string): boolean => !!value.match(NON_KANA_REGEX);

// Split into kanas, spaces, other characters
// Filter out empty values
const splitIntoCharGroups = (value: string): string[] => {
  return value
    .split(KANA_REGEX)
    .flatMap(str => str.split(SPACE_REGEX))
    .filter(Boolean);
};

const extractDiff = (from: string[], to: string[]): Diff => {
  const added = to.filter(x => !from.includes(x));
  const removed = from.filter(x => !to.includes(x));
  return { added, removed };
};

const extractPair = ({ added, removed }: Diff): KanaPair | undefined => {
  if (
    added.length === 1 &&
    removed.length === 1 &&
    isNonKana(added[0]) &&
    isKana(removed[0])
  ) {
    // given
    //   added: ['山田']
    //   removed: ['やまだ']
    // then
    //   paid is { '山田': 'やまだ' }
    return {
      nonKana: added[0],
      kana: removed[0],
    };
  } else if (removed.length === 2 && added.length === 1) {
    // given
    //   added: ['山田']
    //   removed: ['山', 'だ']
    // then
    //   pair is { '田': 'だ' }
    //
    // given
    //   added: ['山田']
    //   removed: ['やま', '田']
    // then
    //   pair is { '山': 'やま' }
    const nonKana = added[0].replace(
      new RegExp(`${removed.join('|')}`, 'g'),
      '',
    );
    const kana = removed.find(isKana) as string;
    return {
      nonKana,
      kana,
    };
  } else {
    return;
  }
};

// Create a map that contains pairs of non-kana and kana
const createMap = (
  kanaMap: KanaMap,
  previousCharGroups: string[],
  currentCharGroups: string[],
): KanaMap => {
  const diff = extractDiff(previousCharGroups, currentCharGroups);
  const pair = extractPair(diff);
  if (pair) {
    return {
      ...kanaMap,
      [pair.nonKana]: pair.kana,
    };
  } else {
    return { ...kanaMap };
  }
};

const convertCharGroupsToKana = (
  kanaMap: KanaMap,
  charGroups: string[],
): string => {
  const knownNonKanas = Object.keys(kanaMap);
  return charGroups
    .map(chars => {
      return knownNonKanas
        .filter(knownNonKana => chars.indexOf(knownNonKana) >= 0)
        .reduce(
          (memo, nonKana) => memo.replace(nonKana, kanaMap[nonKana]),
          chars,
        );
    })
    .filter(isKana)
    .join('');
};

export const useKana = (): {
  kana: string;
  setKanaSource: (value: string) => void;
} => {
  // used by library users
  const [kana, setKana] = useState<string>('');
  // library internal use
  const [previousCharGroups, setPreviousCharGroups] = useState<string[]>([]);
  const [kanaMap, setKanaMap] = useState<KanaMap>({});

  const setKanaSource = (value: string): void => {
    if (value === '') {
      setKana('');
      setKanaMap({});
      setPreviousCharGroups([]);
    } else {
      const currentCharGroups = splitIntoCharGroups(value);
      const kanaMapDup = createMap(
        kanaMap,
        previousCharGroups,
        currentCharGroups,
      );
      const currentKana = convertCharGroupsToKana(
        kanaMapDup,
        currentCharGroups,
      );
      setKana(currentKana);
      setKanaMap(kanaMapDup);
      setPreviousCharGroups(currentCharGroups);
    }
  };

  return { kana, setKanaSource };
};
