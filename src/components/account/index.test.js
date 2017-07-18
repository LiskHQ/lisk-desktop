import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Account from './index';
import AccountComponent from './accountComponent';

describe('<Account />', () => {
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
    // childContextTypes: { store: React.PropTypes.object.isRequired },
  };

  it('should mount AccountComponent with appropriate properties', () => {
    const mountedAccount = mount(<Account/>, options);
    const props = mountedAccount.find(AccountComponent).props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.onActivePeerUpdated).to.be.equal('function');
  });
});
