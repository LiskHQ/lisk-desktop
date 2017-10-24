import mnemonic from 'bitcore-mnemonic';
import { expect } from 'chai';
import {
  findSimilarWord,
  inDictionary,
  levenshteinDistance,
  getWordsFromDictByLength,
  reducedDictByWordLength,
} from './similarWord';

describe('Similar word', () => {
  describe('levenshteinDistance', () => {
    it('should calculate distance between two words', () => {
      expect(levenshteinDistance('apple', 'zoo')).to.be.equal(4);
    });

    it('should the same distance between two words if they are changed their place in the function parameters', () => {
      expect(levenshteinDistance('apple', 'zoo')).to.be.equal(levenshteinDistance('zoo', 'apple'));
    });
  });

  describe('inDictionary', () => {
    it('should return true if word is in the dictionary', () => {
      expect(inDictionary('apple')).to.be.equal(true);
    });

    it('should return false if word not in the dictionary', () => {
      expect(inDictionary('asdfasdf')).to.be.equal(false);
    });
  });

  describe('reducedDictByWordLength', () => {
    it('should be an object with the keys equals to the dictionary words lenght', () => {
      expect(Object.keys(reducedDictByWordLength)).to.deep.equal(['3', '4', '5', '6', '7', '8']);
    });
  });

  describe('getWordsFromDictByLength', () => {
    it('should return array with dictionary words mathed by length, length - 1 and length + 1', () => {
      const expectedWordLenght = mnemonic.Words.ENGLISH
        .filter(el => el.length === 4 || el.length === 3 || el.length === 5).length;
      expect(getWordsFromDictByLength(4).length).to.be.equal(expectedWordLenght);
    });
  });

  describe('findSimilarWord', () => {
    it('should return simmilar word based on Levenshtein distance algorithm', () => {
      expect(findSimilarWord('applu')).to.be.equal('apple');
    });

    it('should return exactly the same word if they exist in the dictionary', () => {
      expect(findSimilarWord('zoo')).to.be.equal('zoo');
    });
  });
});
