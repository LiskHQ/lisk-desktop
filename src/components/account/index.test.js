import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import * as peersActions from '../../actions/peers';
import Account from './index';
import AccountComponent from './accountComponent';

describe('Account', () => {
  // Mocking store
  const onActivePeerUpdated = () => {};
  const peers = {
    status: {
      online: false,
    },
    data: {
      currentPeer: 'localhost',
      port: 4000,
      options: {
        name: 'Custom Node',
      },
    },
  };
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };

  const store = {
    dispatch: () => {},
    subscribe: () => {},
    getState: () => ({
      peers,
      account,
      onActivePeerUpdated,
    }),
  };
  const options = {
    context: { store },
    // childContextTypes: { store: PropTypes.object.isRequired },
  };
  let props;

  beforeEach(() => {
    const mountedAccount = mount(<Account/>, options);
    props = mountedAccount.find(AccountComponent).props();
  });

  it('should mount AccountComponent with appropriate properties', () => {
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.onActivePeerUpdated).to.be.equal('function');
  });

  it('should bind activePeerUpdate action to AccountComponent props.onActivePeerUpdated', () => {
    const actionsSpy = sinon.spy(peersActions, 'activePeerUpdate');
    props.onActivePeerUpdated({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind accountUpdated action to AccountComponent props.onAccountUpdated', () => {
    const actionsSpy = sinon.spy(accountActions, 'accountUpdated');
    props.onAccountUpdated({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind transactionsUpdated action to AccountComponent props.onTransactionsUpdated', () => {
    const actionsSpy = sinon.spy(transactionsActions, 'transactionsUpdated');
    props.onTransactionsUpdated({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
