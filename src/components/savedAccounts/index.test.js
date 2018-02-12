import React from 'react';
import { expect } from 'chai';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SavedAccountsHOC from './index';
import * as savedAccounts from '../../actions/savedAccounts';

const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

describe('SavedAccountsHOC', () => {
  let wrapper;

  const account = {
    isDelegate: false,
    publicKey: 'sample_key',
    username: 'lisk-hub',
  };
  const options = {
    address: 'http://localhost:4000',
    network: 'Custom node',
  };
  const peers = { data: { options }, options };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
    savedAccounts: { accounts: [] },
  });

  beforeEach(() => {
    wrapper = mountWithRouter(<SavedAccountsHOC closeDialog={() => {}} t={(key => key)} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should render SavedAccounts', () => {
    expect(wrapper.find('SavedAccounts')).to.have.lengthOf(1);
  });

  it('should bind accountRemoved action to SavedAccounts props.accountRemoved', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountRemoved');
    wrapper.find('SavedAccounts').props().accountRemoved({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind accountSwitched action to SavedAccounts props.accountSwitched', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountSwitched');
    wrapper.find('SavedAccounts').props().accountSwitched({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

