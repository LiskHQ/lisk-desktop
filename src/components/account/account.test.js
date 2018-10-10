import React from 'react';
import Lisk from 'lisk-elements';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import networks from '../../constants/networks';
import Account from './account';

describe('Account', () => {
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      i18n: {},
      store: {},
      onActivePeerUpdated: sinon.spy(),
      showNetworkIndicator: true,
      peers: {
        status: {
          online: false,
        },
        data: {
          currentPeer: 'localhost',
          port: 4000,
        },
        options: {
          name: 'Custom Node',
        },
      },
      account: {
        isDelegate: false,
        address: '16313739661670634666L',
        username: 'lisk-hub',
        balance: 1e8,
      },
    };
  });

  // Should be updated once we know what happens with this component
  // Maybe it should be merged with the avatar or sidebar part, we don't know yet
  it.skip('should Address component', () => {
    const wrapper = shallow(<Account {...props} />);
    expect(wrapper.find('Address')).to.have.lengthOf(1);
  });

  it('shows network indicator online', () => {
    props.peers.status.online = true;
    props.peers.options.code = networks.mainnet.code;
    const wrapper = shallow(<Account {...props} />);
    wrapper.update();
    expect(wrapper).to.have.exactly(1).descendants('.online');
  });

  it('shows network indicator offline', () => {
    props.peers.status.online = false;
    const wrapper = shallow(<Account {...props} />);
    wrapper.update();
    expect(wrapper).to.have.exactly(1).descendants('.offline');
  });

  it('shows testnet icon when online and nethash matches', () => {
    props.peers.status.online = true;
    props.peers.options.nethash = Lisk.constants.TESTNET_NETHASH;
    props.peers.options.code = networks.customNode.code;
    props.peers.data.currentNode = 'http://localhost:4000';
    const wrapper = shallow(<Account {...props} />);
    wrapper.update();
    expect(wrapper).to.have.exactly(1).descendants('.online');
    expect(wrapper).to.have.exactly(1).descendants('.testnet-title');
  });
});
