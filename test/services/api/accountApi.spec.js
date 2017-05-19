const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: AccountApi', () => {
  let peers;
  let accountApi;
  let peersMock;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Peers_, _AccountApi_) => {
    peers = _Peers_;
    accountApi = _AccountApi_;
  }));

  beforeEach(() => {
    peersMock = sinon.mock(peers);
    peers.setActive({
      name: 'Mainnet',
    });
  });

  afterEach(() => {
    peersMock.verify();
    peersMock.restore();
  });

  describe('transaction.create(recipientId, amount, secret, secondSecret)', () => {
    it('returns Peers.sendRequest(\'transactions\', options);', () => {
      const options = {
        recipientId: '537318935439898807L',
        amount: 10,
        secret: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
        secondSecret: null,
      };
      const spy = sinon.spy(peers, 'sendRequestPromise');

      accountApi.transactions.create(
        options.recipientId, options.amount, options.secret, options.secondSecret);

      expect(spy).to.have.been.calledWith('transactions', options);
    });
  });

  describe('transaction.get(address, limit, offset)', () => {
    it('returns Peers.sendRequest(\'transactions\', options);', () => {
      const options = {
        senderId: '537318935439898807L',
        recipientId: '537318935439898807L',
        limit: 20,
        offset: 0,
      };

      const spy = sinon.spy(peers, 'sendRequestPromise');

      accountApi.transactions.get(
        options.recipientId, options.limit, options.offset);

      expect(spy).to.have.been.calledWith('transactions', options);
    });
  });

  describe('setSecondSecret(secondSecret, publicKey, secret)', () => {
    it('returns Peers.sendRequestPromise(\'signatures\', { secondSecret, publicKey, secret });', () => {
      const publicKey = '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135';
      const secret = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
      const secondSecret = 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive';

      const spy = sinon.spy(peers, 'sendRequestPromise');

      accountApi.setSecondSecret(secondSecret, publicKey, secret);

      expect(spy).to.have.been.calledWith('signatures', { secondSecret, publicKey, secret });
    });
  });
});

