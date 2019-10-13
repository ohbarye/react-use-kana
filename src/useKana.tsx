import { useState } from 'react';

interface KanaMap {
  [key: string]: string;
}

interface Diff {
  added: string[];
  removed: string[];
}

interface KanaPair {
  [key: string]: string;
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

const extractPairFromDiff = ({ added, removed }: Diff): KanaPair => {
  if (added.length === 1 && removed.length === 1 && isNonKana(added[0]) && isKana(removed[0])) {
    // given
    //   added: ['山田']
    //   removed: ['やまだ']
    // then
    //   paid is { '山田': 'やまだ' }
    return {
      [added[0]]: removed[0],
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
    const nonKana = added[0].replace(new RegExp(`${removed.join('|')}`, 'g'), '');
    const kana = removed.find(isKana) as string;
    return {
      [nonKana]: kana,
    };
  } else {
    return {};
  }
};

const findPair = (
  charGroupsCandidates: string[][],
  currentCharGroups: string[],
  setLastConvertedCharGroups: (charGroups: string[]) => void,
): KanaPair => {
  const [previousCharGroups, ...tail] = charGroupsCandidates;
  if (!previousCharGroups) {
    return {};
  }
  const pair = extractPairFromDiff(extractDiff(previousCharGroups, currentCharGroups));

  if (Object.keys(pair).length !== 0) {
    // If a pair of non-kana and kana is found, memoize it for later comparison.
    // This is for a case when a user convert an input from kana to non-kana to non-kana.
    // e.g. 'た' => '多' => '田' . In this case, it needs to store 'た' when making pair of { '多': 'た' }
    //      for the next making pair of { '田': 'た' }
    setLastConvertedCharGroups(previousCharGroups);
    return pair;
  } else {
    // The first trial to find pair (between the latest input and the 2nd latest input) fails,
    // it retries once more by using `lastConvertedCharGroups`.
    return findPair(tail, currentCharGroups, setLastConvertedCharGroups);
  }
};

const convertCharGroupsToKana = (kanaMap: KanaMap, charGroups: string[]): string => {
  const knownNonKanas = Object.keys(kanaMap);
  return charGroups
    .map(chars => {
      return knownNonKanas
        .filter(knownNonKana => chars.indexOf(knownNonKana) >= 0)
        .reduce((memo, nonKana) => memo.replace(nonKana, kanaMap[nonKana]), chars);
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
  const [lastConvertedCharGroups, setLastConvertedCharGroups] = useState<string[]>([]);
  const [kanaMap, setKanaMap] = useState<KanaMap>({});

  const setKanaSource = (value: string): void => {
    if (value === '') {
      // If a user inputs nothing, reset everything
      setKana('');
      setKanaMap({});
      setPreviousCharGroups([]);
    } else {
      const currentCharGroups = splitIntoCharGroups(value);
      // Create kana map that contains pairs of non-kana and kana based on the original map
      const latestKanaMap = {
        ...kanaMap,
        ...findPair([previousCharGroups, lastConvertedCharGroups], currentCharGroups, setLastConvertedCharGroups),
      };
      const currentKana = convertCharGroupsToKana(latestKanaMap, currentCharGroups);
      setKana(currentKana);
      setKanaMap(latestKanaMap);
      setPreviousCharGroups(currentCharGroups);
    }
  };

  return { kana, setKanaSource };
};
