import { expect } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import actionTypes from '../constants/actions';
import { accountUpdated, accountLoggedOut,
  secondPassphraseRegistered, delegateRegistered, sent } from './account';
import { transactionAdded } from './transactions';
import { errorAlertDialogDisplayed } from './dialog';
import * as accountApi from '../utils/api/account';
import Fees from '../constants/fees';

sinonStubPromise(sinon);

describe.only('actions: account', () => {
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
    const accountApiMock = sinon.stub(accountApi, 'setSecondPassphrase');
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
      dispatch = sinon.spy();
    });

    afterEach(() => {
      accountApiMock.resolves();
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
        type: 1,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(transactionAdded(expectedAction));
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
    const accountApiMock = sinon.stub(accountApi, 'registerDelegate');
    const data = {
      activePeer: {},
      username: 'test',
      secondPassphrase: null,
      account: {
        publicKey: 'test_public-key',
        address: 'test_address',
      },
    };
    const actionFunction = delegateRegistered(data);
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
    });

    afterEach(() => {
      accountApiMock.resolves();
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
        username: data.username,
        amount: 0,
        fee: Fees.registerDelegate,
        type: 2,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(transactionAdded(expectedAction));
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
      const expectedAction = errorAlertDialogDisplayed({ text: 'An error occurred while registering as delegate.' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('sent', () => {
    const data = {
      activePeer: {},
      recipientId: '15833198055097037957L',
      amount: 100,
      passphrase: 'sample passphrase',
      secondPassphrase: null,
      account: {},
    };

    it('should create an action function', () => {
      const actionFunction = sent(data);
      expect(typeof actionFunction).to.be.deep.equal('function');
    });
  });
});
