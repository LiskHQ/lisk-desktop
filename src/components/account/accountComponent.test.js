import React from 'react';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../store';
import AccountComponent from './accountComponent';
import ClickToSend from '../send/clickToSend';

chai.use(sinonChai);

describe('AccountComponent', () => {
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
  const testAccount = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
    balance: 1e8,
  };

  it(' should render 3 article tags', () => {
    const wrapper = shallow(<AccountComponent account={testAccount} peers={peers}
      onActivePeerUpdated={onActivePeerUpdated} />);
    expect(wrapper.find('article')).to.have.lengthOf(3);
  });

  it('depicts being online when peers.status.online is true', () => {
    const onlinePeers = Object.assign({}, peers, { status: { online: true } });
    const wrapper = shallow(<AccountComponent account={testAccount} peers={onlinePeers}
      onActivePeerUpdated={onActivePeerUpdated} />);
    const expectedValue = 'check';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });

  it('should render balance with ClickToSend component', () => {
    const wrapper = mount(<Provider store={store}>
      <AccountComponent account={testAccount} peers={peers}
        onActivePeerUpdated={onActivePeerUpdated} />
    </Provider>);
    expect(wrapper.find('.balance').find(ClickToSend)).to.have.lengthOf(1);
  });
});
