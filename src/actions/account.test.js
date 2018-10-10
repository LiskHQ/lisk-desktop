import { expect } from 'chai';
import { spy, stub } from 'sinon';
import i18next from 'i18next';
import actionTypes from '../constants/actions';
import {
  accountUpdated,
  accountLoggedOut,
  secondPassphraseRegistered,
  delegateRegistered,
  removePassphrase,
  passphraseUsed,
  loadDelegate,
  loadAccount,
  accountDataUpdated,
  updateTransactionsIfNeeded,
  updateDelegateAccount,
} from './account';
import { errorAlertDialogDisplayed } from './dialog';
import { delegateRegisteredFailure } from './delegate';
import * as accountApi from '../utils/api/account';
import * as delegateApi from '../utils/api/delegate';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';
import * as peersActions from './peers';
import * as transactionsActions from './transactions';

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
    let i18nextMock;
    const data = {
      passphrase: accounts['second passphrase account'].passphrase,
      secondPassphrase: accounts['second passphrase account'].secondPassphrase,
      account: {
        publicKey: accounts['second passphrase account'].publicKey,
        address: accounts['second passphrase account'].address,
      },
    };
    const actionFunction = secondPassphraseRegistered(data);
    let dispatch;
    let getState;

    beforeEach(() => {
      accountApiMock = stub(accountApi, 'setSecondPassphrase');
      dispatch = spy();
      getState = () => ({
        peers: { data: {} },
      });
      i18nextMock = stub(i18next, 't');
      i18next.t = key => key;
    });

    afterEach(() => {
      accountApiMock.restore();
      i18nextMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      accountApiMock.returnsPromise().resolves({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: accounts['second passphrase account'].publicKey,
        senderId: accounts['second passphrase account'].address,
        amount: 0,
        fee: Fees.setSecondPassphrase,
        type: transactionTypes.setSecondPassphrase,
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should dispatch errorAlertDialogDisplayed action if caught', () => {
      accountApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch, getState);
      const expectedAction = errorAlertDialogDisplayed({ text: 'sample message' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch errorAlertDialogDisplayed action if caught but no message returned', () => {
      accountApiMock.returnsPromise().rejects({});

      actionFunction(dispatch, getState);
      const expectedAction = errorAlertDialogDisplayed({ text: 'An error occurred while registering your second passphrase. Please try again.' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('delegateRegistered', () => {
    let delegateApiMock;
    const data = {
      username: 'test',
      passphrase: accounts.genesis.passphrase,
      secondPassphrase: null,
      account: {
        publicKey: accounts['second passphrase account'].publicKey,
        address: accounts['second passphrase account'].address,
      },
    };
    const actionFunction = delegateRegistered(data);
    let dispatch;
    let getState;

    beforeEach(() => {
      delegateApiMock = stub(delegateApi, 'registerDelegate');
      dispatch = spy();
      getState = () => ({
        peers: { data: {} },
        blocks: { latestBlocks: [] },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      delegateApiMock.returnsPromise().resolves({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: accounts['second passphrase account'].publicKey,
        senderId: accounts['second passphrase account'].address,
        username: data.username,
        amount: 0,
        fee: Fees.registerDelegate,
        type: transactionTypes.registerDelegate,
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should dispatch delegateRegisteredFailure action if caught', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message.' });

      actionFunction(dispatch, getState);
      const delegateRegisteredFailureAction = delegateRegisteredFailure({ message: 'sample message.' });
      expect(dispatch).to.have.been.calledWith(delegateRegisteredFailureAction);
    });

    it('should dispatch passphraseUsed action always', () => {
      delegateApiMock.returnsPromise().rejects({ message: 'sample message.' });

      actionFunction(dispatch, getState);
      const passphraseUsedAction = passphraseUsed(accounts.genesis.passphrase);
      expect(dispatch).to.have.been.calledWith(passphraseUsedAction);
    });
  });

  describe('loadDelegate', () => {
    let delegateApiMock;
    let dispatch;
    let getState;

    const data = {
      publicKey: accounts.genesis.publicKey,
    };
    const actionFunction = loadDelegate(data);

    beforeEach(() => {
      delegateApiMock = stub(delegateApi, 'getDelegate');
      dispatch = spy();
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      delegateApiMock.restore();
    });

    it('should dispatch updateDelegate with delegate response', () => {
      const delegateResponse = { delegate: { ...accounts['delegate candidate'] } };
      delegateApiMock.returnsPromise().resolves(delegateResponse);

      actionFunction(dispatch, getState);
      const updateDelegateAction = {
        data: delegateResponse,
        type: actionTypes.updateDelegate,
      };
      expect(dispatch).to.have.been.calledWith(updateDelegateAction);
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

  describe('loadAccount', () => {
    let getAccountStub;
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      getAccountStub = stub(accountApi, 'getAccount').returnsPromise();
      transactionsActionsStub = spy(transactionsActions, 'loadTransactionsFinish');
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      getAccountStub.restore();
      transactionsActionsStub.restore();
    });

    it('should finish transactions load and load delegate if not own account', () => {
      getAccountStub.resolves({
        balance: 10e8,
        publicKey: accounts.genesis.publicKey,
        isDelegate: false,
      });

      const data = {
        address: accounts.genesis.address,
        transactionsResponse: { meta: { count: 0 }, data: [] },
        isSameAccount: false,
      };

      loadAccount(data)(dispatch, getState);
      expect(transactionsActionsStub).to.have.been.calledWith({
        confirmed: [],
        count: 0,
        balance: 10e8,
        address: accounts.genesis.address,
      });
    });

    it('should finish transactions load and should not load delegate if own account', () => {
      getAccountStub.resolves({
        balance: 10e8,
        publicKey: accounts.genesis.publicKey,
        isDelegate: true,
        delegate: 'delegate information',
      });

      const data = {
        address: accounts.genesis.address,
        transactionsResponse: { meta: { count: 0 }, data: [] },
        isSameAccount: true,
      };

      loadAccount(data)(dispatch, getState);
      expect(transactionsActionsStub).to.have.been.calledWith({
        confirmed: [],
        count: 0,
        balance: 10e8,
        address: accounts.genesis.address,
        delegate: 'delegate information',
      });
    });
  });

  describe('accountDataUpdated', () => {
    let peersActionsStub;
    let getAccountStub;
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      peersActionsStub = spy(peersActions, 'activePeerUpdate');
      getAccountStub = stub(accountApi, 'getAccount').returnsPromise();
      transactionsActionsStub = spy(transactionsActions, 'transactionsUpdated');
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      getAccountStub.restore();
      peersActionsStub.restore();
      transactionsActionsStub.restore();
    });

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
      getAccountStub.resolves({ balance: 10e8 });

      const data = {
        windowIsFocused: false,
        transactions: {
          pending: [{
            id: 12498250891724098,
          }],
          confirmed: [],
          account: { address: accounts['second passphrase account'].address, balance: 0 },
        },
        account: { address: accounts.genesis.address, balance: 0 },
      };

      accountDataUpdated(data)(dispatch, getState);
      expect(dispatch).to.have.callCount(3);
      expect(peersActionsStub).to.have.not.been.calledWith({ online: false, code: 'EUNAVAILABLE' });
    });

    it(`should call account API methods on ${actionTypes.newBlockCreated} action when offline`, () => {
      getAccountStub.rejects({ error: { code: 'EUNAVAILABLE' } });

      const data = {
        windowIsFocused: true,
        transactions: {
          pending: [{ id: 12498250891724098 }],
          confirmed: [],
          account: { address: accounts['second passphrase account'].address, balance: 0 },
        },
        account: { address: accounts.genesis.address },
      };

      accountDataUpdated(data)(dispatch, getState);
      expect(peersActionsStub).to.have.been.calledWith({ online: false, code: 'EUNAVAILABLE' });
    });
  });

  describe('updateTransactionsIfNeeded', () => {
    let transactionsActionsStub;
    let getState;

    const dispatch = spy();

    beforeEach(() => {
      transactionsActionsStub = spy(transactionsActions, 'transactionsUpdated');
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      transactionsActionsStub.restore();
    });

    it('should update transactions when window is in focus', () => {
      const data = {
        transactions: { confirmed: [{ confirmations: 10 }], pending: [] },
        account: { address: accounts.genesis.address },
      };

      updateTransactionsIfNeeded(data, true)(dispatch, getState);
      expect(transactionsActionsStub).to.have.been.calledWith();
    });

    it('should update transactions when there are no recent transactions', () => {
      const data = {
        transactions: { confirmed: [{ confirmations: 10000 }], pending: [{ id: '123' }] },
        account: { address: accounts.genesis.address },
      };

      updateTransactionsIfNeeded(data, false)(dispatch, getState);
      expect(transactionsActionsStub).to.have.been.calledWith();
    });
  });

  describe('updateDelegateAccount', () => {
    const dispatch = spy();
    let getState;

    beforeEach(() => {
      stub(delegateApi, 'getDelegate').returnsPromise();
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      delegateApi.getDelegate.restore();
    });

    it('should fetch delegate and update account', () => {
      delegateApi.getDelegate.resolves({ data: [{ account: 'delegate data' }] });
      const data = {
        publicKey: accounts.genesis.publicKey,
      };

      updateDelegateAccount(data)(dispatch, getState);

      const accountUpdatedAction = accountUpdated(Object.assign({}, { delegate: { account: 'delegate data' }, isDelegate: true }));
      expect(dispatch).to.have.been.calledWith(accountUpdatedAction);
    });
  });
});
