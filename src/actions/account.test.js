import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import { accountUpdated, accountLoggedOut,
  secondPassphraseRegistered, delegateRegistered, sent, removePassphrase, passphraseUsed } from './account';
import { errorAlertDialogDisplayed } from './dialog';
import { delegateRegisteredFailure } from './delegate';
import * as accountApi from '../utils/api/account';
import * as delegateApi from '../utils/api/delegate';
import Fees from '../constants/fees';
import { toRawLsk } from '../utils/lsk';
import transactionTypes from '../constants/transactionTypes';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';

describe('actions: account', () => {
  describe('accountUpdated', () => {
    it('should create an action to set values to account', () => {
      const data = {
        passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
      };

      const expectedAction = {
        data,
        type: actionTypes.accountUpdated,
      };
      expect(accountUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('accountLoggedOut', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.accountLoggedOut,
      };

      expect(accountLoggedOut()).to.be.deep.equal(expectedAction);
    });
  });

  describe('secondPassphraseRegistered', () => {
    let accountApiMock;
    const data = {
      activePeer: {},
      secondPassphrase: 'sample second passphrase',
      account: {
        publicKey: 'test_public-key',
        address: 'test_address',
      },
    };
    const actionFunction = secondPassphraseRegistered(data);
    let dispatch;

    beforeEach(() => {
      accountApiMock = sinon.stub(accountApi, 'setSecondPassphrase');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      accountApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      accountApiMock.returnsPromise().resolves({ transactionId: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: 'test_public-key',
        senderId: 'test_address',
        amount: 0,
        fee: Fees.setSecondPassphrase,
        type: transactionTypes.setSecondPassphrase,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should dispatch errorAlertDialogDisplayed action if caught', () => {
      accountApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch);
      const expectedAction = errorAlertDialogDisplayed({ text: 'sample message' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch errorAlertDialogDisplayed action if caught but no message returned', () => {
      accountApiMock.returnsPromise().rejects({});

      actionFunction(dispatch);
      const expectedAction = errorAlertDialogDisplayed({ text: 'An error occurred while registering your second passphrase. Please try again.' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('delegateRegistered', () => {
    let delegateApiMock;
    const data = {
      activePeer: {},
      username: 'test',
      passphrase: accounts.genesis.passphrase,
      secondPassphrase: null,
      account: {
        publicKey: 'test_public-key',
        address: 'test_address',
      },
    };
    const actionFunction = delegateRegistered(data);
    let dispatch;

    beforeEach(() => {
      delegateApiMock = sinon.stub(delegateApi, 'registerDelegate');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      delegateApiMock.returnsPromise().resolves({ transactionId: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: 'test_public-key',
        senderId: 'test_address',
        username: data.username,
        amount: 0,
        fee: Fees.registerDelegate,
        type: transactionTypes.registerDelegate,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should dispatch delegateRegisteredFailure action if caught', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message.' });

      actionFunction(dispatch);
      const delegateRegisteredFailureAction = delegateRegisteredFailure({ message: 'sample message.' });
      expect(dispatch).to.have.been.calledWith(delegateRegisteredFailureAction);
    });

    it('should dispatch passphraseUsed action always', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message.' });

      actionFunction(dispatch);
      const passphraseUsedAction = passphraseUsed(accounts.genesis.passphrase);
      expect(dispatch).to.have.been.calledWith(passphraseUsedAction);
    });
  });

  describe('sent', () => {
    let accountApiMock;
    const data = {
      activePeer: {},
      recipientId: '15833198055097037957L',
      amount: 100,
      passphrase: 'sample passphrase',
      secondPassphrase: null,
      account: {
        publicKey: 'test_public-key',
        address: 'test_address',
      },
    };
    const actionFunction = sent(data);
    let dispatch;

    beforeEach(() => {
      accountApiMock = sinon.stub(accountApi, 'send');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      accountApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      accountApiMock.returnsPromise().resolves({ transactionId: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: 'test_public-key',
        senderId: 'test_address',
        recipientId: data.recipientId,
        amount: toRawLsk(data.amount),
        fee: Fees.send,
        type: transactionTypes.send,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should dispatch transactionFailed action if caught', () => {
      accountApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch);
      const expectedAction = {
        data: {
          errorMessage: 'sample message.',
        },
        type: actionTypes.transactionFailed,
      };
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch transactionFailed action if caught but no message returned', () => {
      accountApiMock.returnsPromise().rejects({});

      actionFunction(dispatch);
      const expectedAction = {
        data: {
          errorMessage: 'An error occurred while creating the transaction.',
        },
        type: actionTypes.transactionFailed,
      };
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('removePassphrase', () => {
    it('should create an action to remove passphrase', () => {
      const data = {
        publicKey: accounts.genesis.publicKey,
        network: networks.testnet,
        address: accounts.genesis.address,
      };

      const expectedAction = {
        data,
        type: actionTypes.removePassphrase,
      };

      expect(removePassphrase(data)).to.be.deep.equal(expectedAction);
    });
  });
});
