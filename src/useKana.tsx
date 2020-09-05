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

type KanaType = 'hiragana' | 'katakana';

const KANA_REGEX = /([ 　ぁあ-んーわ゙ゐ゙ゔゑ゙を゙]+)/g; // eslint-disable-line no-misleading-character-class
const NON_KANA_REGEX = /([^ 　ぁあ-んーわ゙ゐ゙ゔゑ゙を゙]+)/g; // eslint-disable-line no-misleading-character-class
const SPACE_REGEX = /([ 　]+)/g;
const ALPHABET_USED_DURING_INPUT_REGEX = /[ａ-ｚ]+/g;

const isKana = (value: string): boolean => !!value.match(KANA_REGEX);
const isNonKana = (value: string): boolean => !!value.match(NON_KANA_REGEX);

// Split into kanas, spaces, other characters

const splitIntoCharGroups = (value: string): string[] => {
  return value
    .split(KANA_REGEX)
    .flatMap(str => str.split(SPACE_REGEX))
    .map(str => str.replace(ALPHABET_USED_DURING_INPUT_REGEX, '')) // trim '山ｄ' => '山'
    .filter(Boolean); // Filter out empty values
};

const extractDiff = (from: string[], to: string[]): Diff => {
  const added = to.filter(x => !from.includes(x));
  const removed = from.filter(x => !to.includes(x));
  return { added, removed };
};

const extractPairFromDiff = ({ added, removed }: Diff): KanaPair => {
  // What's the No.?
  // Conversion pattern: See details in https://docs.google.com/spreadsheets/d/13kMl3XQ2SG9BQTYaP-lUeVPu5I6u7Xi8Gw3H6ErYqyM/edit?usp=sharing

  if (
    added.length === 0 || // No. 1, 4, 5, 11
    removed.length === 0 || // No. 1, 2, 3, 6
    added.every(isKana) || // No. 3, 9, 10, 15
    removed.every(isNonKana) // No. 4, 7, 9, 10
  ) {
    // For No. 7 (from nonKana to nonKana), it's going to fallback to No. 14
    return {};
  } else if (removed.some(isNonKana) && removed.some(isKana) && added.every(isNonKana)) {
    // No. 14 (from mixed of kana and nonKana, to nonKana)
    // given
    //   added: ['山田']
    //   removed: ['山', 'だ']
    // then
    //   pair is { '田': 'だ' }
    let addedString = added.join('');

    return removed.reduce((resultMap: KanaMap, removedChars, i) => {
      if (isNonKana(removedChars)) {
        const position = addedString.indexOf(removedChars);
        if (position === 0) {
          addedString = addedString.slice(removedChars.length);
        } else if (position > 0) {
          resultMap[addedString.slice(0, position)] = removed[i - 1];
          addedString = addedString.slice(position + 1);
        }
      } else if (isKana(removedChars) && i === removed.length - 1) {
        // If the last string is kana, couple it with the remaining nonKana
        resultMap[addedString] = removedChars;
      }
      return resultMap;
    }, {});
  } else {
    // No. 8 (from kana to nonKana)
    // No. 13 (from kana to mixed of kana and nonKana)
    // given
    //   added: ['山', 'だ']
    //   removed: ['やまだ']
    // then
    //   pair is { '山': 'やま' }
    let removedString = removed.join('');

    return added.reduce((resultMap: KanaMap, addedChars, i) => {
      if (isKana(addedChars)) {
        const position = removedString.indexOf(addedChars);
        if (position === 0) {
          removedString = removedString.slice(addedChars.length);
        } else if (position > 0) {
          resultMap[added[i - 1]] = removedString.slice(0, position);
          removedString = removedString.slice(position + 1);
        }
      } else if (isNonKana(addedChars) && i === added.length - 1) {
        // If the last string is nonKana, couple it with the remaining kana
        resultMap[addedChars] = removedString;
      }
      return resultMap;
    }, {});
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
  const diff = extractDiff(previousCharGroups, currentCharGroups);
  const pair = extractPairFromDiff(diff);

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

const hiraganaToKatatana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, (ch: string) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
};

const convertCharGroupsToKana = (kanaMap: KanaMap, charGroups: string[], kanaType: KanaType): string => {
  const knownNonKanas = Object.keys(kanaMap);
  const hiragana = charGroups
    .map(chars => {
      return knownNonKanas
        .filter(knownNonKana => chars.indexOf(knownNonKana) >= 0)
        .reduce((memo, nonKana) => memo.replace(nonKana, kanaMap[nonKana]), chars);
    })
    .filter(isKana)
    .join('');
  if (kanaType === 'katakana') {
    return hiraganaToKatatana(hiragana);
  } else {
    return hiragana;
  }
};

export const useKana = ({
  kanaType = 'hiragana' as const,
}: {
  kanaType?: KanaType;
} = {}): {
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
      const currentKana = convertCharGroupsToKana(latestKanaMap, currentCharGroups, kanaType);
      setKana(currentKana);
      setKanaMap(latestKanaMap);
      setPreviousCharGroups(currentCharGroups);
    }
  };

  return { kana, setKanaSource };
};
