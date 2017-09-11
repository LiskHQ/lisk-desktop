import mnemonic from 'bitcore-mnemonic';

const MAX_WORD_LENGTH = 8;

/**
 * Calculate Levenshtain distance betwen two words
 * https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param {string} word1
 * @param {string} word2
 * @returns {number} The distance between two words
 */
export const levenshteinDistance = (word1, word2) => {
  const calculateDistance = (i, j) => {
    if (Math.min(i, j) === 0) return Math.max(i, j);

    return Math.min(
      calculateDistance(i, j - 1) + 1,
      calculateDistance(i - 1, j) + 1,
      calculateDistance(i - 1, j - 1) + (word1[i] !== word2[j] ? 1 : 0),
    );
  };

  return calculateDistance(word1.length, word2.length);
};

/**
 * @param {string} word
 * @returns {bool}
 */
export const inDictionary = word =>
  mnemonic.Words.ENGLISH.indexOf(word) !== -1;

export const reducedDictByWordLength =
  mnemonic.Words.ENGLISH.reduce((acc, el) => {
    const len = el.length;
    if (acc[len]) {
      acc[len].push(el);
    } else {
      acc[len] = [el];
    }
    return acc;
  }, {});

const getByKey = key =>
  [
    reducedDictByWordLength[key - 1],
    reducedDictByWordLength[key],
    reducedDictByWordLength[key + 1],
  ];


export const getWordsFromDictByLength = (len) => {
  const n = len > MAX_WORD_LENGTH ? MAX_WORD_LENGTH : len;
  return getByKey(n)
    .filter(el => el)
    .reduce((acc, el) => acc.concat(el), []);
};

const matchPartOfString = (word, begin, end) =>
  word.startsWith(begin) || word.endsWith(end);

/**
 * Find the similar word based on invalid word
 * @param {string} invalidWord
 * @returns {string} Similar word
 */
export const findSimilarWord = (invalidWord) => {
  let similarWorld;
  let prevDistance = 100;
  const n = Math.floor((invalidWord.length - 1) / 2);

  const beginWith = invalidWord.slice(0, n);
  const endsWith = invalidWord.slice(-n);

  const dictionary = getWordsFromDictByLength(invalidWord.length);

  for (let i = 0; i < dictionary.length; i++) {
    const validWord = dictionary[i];
    if (validWord.indexOf(invalidWord) !== -1) {
      return validWord;
    }
    if (matchPartOfString(validWord, beginWith, endsWith)) {
      const distance = levenshteinDistance(invalidWord, validWord);
      if (distance < prevDistance) {
        prevDistance = distance;
        similarWorld = validWord;
      }
    }
  }
  return similarWorld;
};
