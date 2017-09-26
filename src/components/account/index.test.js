import React from 'react';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import PropTypes from 'prop-types';
import AccountHOC from './index';
import i18n from '../../i18n';

describe('Account HOC', () => {
  // Mocking store
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

  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };
  let props;

  beforeEach(() => {
    const mountedAccount = shallow(<AccountHOC/>, options);
    props = mountedAccount.find('Account').props();
  });

  it.skip('should mount AccountComponent with appropriate properties', () => {
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
  });
});
