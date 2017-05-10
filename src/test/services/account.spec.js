const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: Account', () => {
  let $peers;
  let $q;
  let account;
  let mock;
  let deffered;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$peers_, _$q_, Account) => {
    $peers = _$peers_;
    $q = _$q_;
    account = Account;
  }));

  beforeEach(() => {
    deffered = $q.defer();
    mock = sinon.mock($peers);
  });

  afterEach(() => {
    mock.verify();
    mock.restore();
  });

  describe('sendLSK(recipientId, amount, secret, secondSecret)', () => {
    it('returns $peers.sendRequestPromise(\'transactions\', options);', () => {
      const options = {
        recipientId: '537318935439898807L',
        amount: 10,
        secret: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
        secondSecret: null,
      };
      mock.expects('sendRequestPromise').withArgs('transactions', options).returns(deffered.promise);

      const promise = account.sendLSK(
        options.recipientId, options.amount, options.secret, options.secondSecret);

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('listTransactions(address, limit, offset)', () => {
    it('returns $peers.sendRequestPromise(\'transactions\', options);', () => {
      const options = {
        senderId: '537318935439898807L',
        recipientId: '537318935439898807L',
        limit: 20,
        offset: 0,
      };
      mock.expects('sendRequestPromise').withArgs('transactions', options).returns(deffered.promise);

      const promise = account.listTransactions(
        options.recipientId, options.limit, options.offset);

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('setSecondSecret(secondSecret, publicKey, secret)', () => {
    it('returns $peers.sendRequestPromise(\'signatures\', { secondSecret, publicKey, secret });', () => {
      const publicKey = '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135';
      const secret = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
      const secondSecret = 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive';
      mock.expects('sendRequestPromise')
        .withArgs('signatures', { secondSecret, publicKey, secret })
        .returns(deffered.promise);

      const promise = account.setSecondSecret(secondSecret, publicKey, secret);

      expect(promise).to.equal(deffered.promise);
    });
  });
});

