import { expect } from 'chai';
import sinon from 'sinon';
import { listAccountDelegates,
  listDelegates,
  getDelegate,
  getVotes,
  getVoters,
  vote,
  registerDelegate } from './delegate';
import * as peers from './peers';
import accounts from '../../../test/constants/accounts';

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
      const options = { publicKey: `"${accounts.delegate.publicKey}"` };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/get', options)
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getDelegate(activePeer, options);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });

  describe('getVotes', () => {
    it('should return requestToActivePeer(activePeer, `accounts/delegates/`, options)', () => {
      const { address } = accounts.delegate;
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'accounts/delegates/', { address })
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getVotes(activePeer, address);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });


  describe('getVoters', () => {
    it('should return requestToActivePeer(activePeer, `delegates/voters`, options)', () => {
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/voters', { publicKey })
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getVoters(activePeer, publicKey);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
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
        activePeer,
        data.username, data.secret, data.secondSecret,
      );
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
});
