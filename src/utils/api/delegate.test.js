import { expect } from 'chai';
import sinon from 'sinon';
import { listAccountDelegates,
  listDelegates,
  getDelegate,
  vote,
  voteAutocomplete,
  unvoteAutocomplete,
  registerDelegate } from './delegate';
import * as peers from './peers';

const username = 'genesis_1';
const secret = 'sample_secret';
const secondSecret = 'samepl_second_secret';
const publicKey = '';

describe('Utils: Delegate', () => {
  let peersMock;
  let activePeer;

  beforeEach(() => {
    peersMock = sinon.mock(peers);
    activePeer = {};
  });

  afterEach(() => {
    peersMock.verify();
    peersMock.restore();
  });

  describe('listAccountDelegates', () => {
    it('should return a promise', () => {
      const promise = listAccountDelegates();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('listDelegates', () => {
    it('should return requestToActivePeer(activePeer, `delegates/`, options) if options = {}', () => {
      const options = {};
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/', options)
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = listDelegates(activePeer, options);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });

    it('should return requestToActivePeer(activePeer, `delegates/search`, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/search', options)
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = listDelegates(activePeer, options);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });

  describe('getDelegate', () => {
    it('should return requestToActivePeer(activePeer, `delegates/get`, options)', () => {
      const options = { publicKey: '"86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"' };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/get', options)
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getDelegate(activePeer, options);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });

  describe('unvoteAutocomplete', () => {
    it('should return a promise that resolves an empty array when trying to unvote a non-existing user name', () => {
      const voteList = {
        genesis_1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
        genesis_2: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
        genesis_3: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
      };

      const nonExistingUsername = 'genesis_4';
      return expect(unvoteAutocomplete(nonExistingUsername, voteList)).to.eventually.eql([]);
    });

    it('should return a promise that resolves an array when trying to unvote an existing user name', () => {
      const voteList = {
        genesis_1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
        genesis_2: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
        genesis_3: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
      };

      const expectedResult = [{ username: 'genesis_1', publicKey: 'sample_key' }];
      return expect(unvoteAutocomplete(username, voteList)).to.eventually.eql(expectedResult);
    });
  });

  describe('registerDelegate', () => {
    it('should return requestToActivePeer(activePeer, `delegates`, data)', () => {
      const data = {
        username: 'test',
        secret: 'wagon dens',
        secondSecret: 'wagon dens',
      };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates', data)
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = registerDelegate(
        activePeer, data.username, data.secret, data.secondSecret);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });

    it('should return requestToActivePeer(activePeer, `delegates`, data) even if no secondSecret specified', () => {
      const data = {
        username: 'test',
        secret: 'wagon dens',
      };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates', data)
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = registerDelegate(activePeer, data.username, data.secret);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
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
    it('should return requestToActivePeer(activePeer, `delegates/`, data)', () => {
      const delegates = [
        { username: 'genesis_42' },
        { username: 'genesis_44' },
      ];
      const votedDict = { genesis_3: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' } };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/search', { q: username })
        .returnsPromise().resolves({ success: true, delegates });

      const returnedPromise = voteAutocomplete(activePeer, username, votedDict);
      return expect(returnedPromise).to.eventually.eql(delegates);
    });
  });
});
