import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { listAccountDelegates,
  listDelegates,
  getDelegate,
  vote,
  voteAutocomplete,
  unvoteAutocomplete,
  registerDelegate } from './delegate';

chai.use(sinonChai);
const username = 'genesis_1';
const secret = 'sample_secret';
const secondSecret = 'samepl_second_secret';
const publicKey = '';

describe('Delegate', () => {
  describe('listAccountDelegates', () => {
    it('should return a promise', () => {
      const promise = listAccountDelegates();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('listDelegates', () => {
    it('should return a promise', () => {
      const promise = listDelegates(null, {});
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('getDelegate', () => {
    it('should return a promise', () => {
      const promise = getDelegate();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('unvoteAutocomplete', () => {
    it('should return a promise', () => {
      const votedList = ['genesis_1', 'genesis_2', 'genesis_3'];
      const nonExistingUsername = 'genesis_4';
      const promise = unvoteAutocomplete(username, votedList);
      expect(typeof promise.then).to.be.equal('function');
      promise.then((result) => {
        expect(result).to.be.equal(true);
      });

      unvoteAutocomplete(nonExistingUsername, votedList).then((result) => {
        expect(result).to.be.equal(false);
      });
    });
  });

  describe('registerDelegate', () => {
    it('should return a promise', () => {
      const promise = registerDelegate(null, username, secret, secondSecret);
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('vote', () => {
    it('should return a promise', () => {
      const voteList = [{
        username: 'genesis_1',
        publicKey: 'sample_publicKey_1',
      }];
      const unvoteList = [{
        username: 'genesis_2',
        publicKey: 'sample_publicKey_2',
      }];
      const promise = vote(null, secret, publicKey, voteList, unvoteList, secondSecret);
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('voteAutocomplete', () => {
    it('should return a promise', () => {
      const promise = voteAutocomplete();
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
