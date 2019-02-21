import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';

import LedgerLogin from './ledgerLogin';
import * as ledgerUtils from '../../utils/ledger';

import networks from '../../constants/networks';
import { loginType } from '../../constants/hwConstants';

describe('LedgerLogin', () => {
  const store = {
    peers: {},
    account: {},
    settings: { network: networks.mainnet.code },
    liskAPIClient: {},
    liskAPIClientSet: () => {},
    loadingFinished: () => {},
    loadingStarted: () => {},
  };

  let wrapper;
  let props;
  let getAccountFromLedgerIndexStub;

  beforeEach(() => {
    getAccountFromLedgerIndexStub = stub(ledgerUtils, 'getAccountFromLedgerIndex').resolves({
      balance: 10e8,
      isDelegate: false,
    });

    props = {
      account: { address: '123L' },
      errorToastDisplayed: spy(),
      settingsUpdated: () => {},
      isEditMode: true,
      loginType: loginType.ledger,
      settings: {},
      t: () => {},
      history: { replace: () => {}, push: spy() },
    };

    wrapper = mount(<LedgerLogin {...props} />, { storeState: store });
  });

  afterEach(() => {
    getAccountFromLedgerIndexStub.restore();
  });

  it('should click addAccountCard', async () => {
    wrapper.setState({
      hardwareAccountsName: {
        '123L': 'test',
      },
      hwAccounts: [{ address: '123L' }],
      isLoading: false,
    });

    wrapper.find('.editMode').simulate('click');
    wrapper.find('ToolBoxInput').simulate('change', { target: { value: 'test1' } });

    wrapper.find('.saveAccountNames').simulate('click');
    expect(wrapper.find('.saveAccountNames').exists()).to.equal(false);
  });

  it('should display an error on adding new ledger account', () => {
    wrapper.setState({
      hardwareAccountsName: {
        '123L': 'test',
      },
      hwAccounts: [{ address: '123L' }],
      isLoading: false,
    });
    wrapper.find('.addAccountCard').simulate('click');
    expect(props.errorToastDisplayed).to.be.calledWith();
  });

  it('should change state when changing accountCard input', () => {
    wrapper.setState({
      hardwareAccountsName: {
        '123L': 'test',
      },
      hwAccounts: [{ address: '123L', isInitialized: true }],
      isLoading: false,
    });
    wrapper.find('AccountCard').props().changeInput();
    expect(wrapper.state().hardwareAccountsName).to.eql({
      '123L': 'test',
      undefined: '',
    });
  });

  it('should change state when changing accountCard input', () => {
    wrapper.setState({
      hardwareAccountsName: {
        '123L': 'test',
      },
      hwAccounts: [{ address: '123L', isInitialized: true }],
      isLoading: false,
    });
    wrapper.find('AddAccountCard').props().addAccount();
    expect(wrapper.state().hwAccounts).to.eql([
      { address: '123L', isInitialized: true },
    ]);
  });
});
