import React from 'react';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow, mount } from 'enzyme';
import AccountComponent from './accountComponent';

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

  it('depicts being offline when peers.offline is false', () => {
    const wrapper = shallow(<AccountComponent account={testAccount} peers={peers}
      onActivePeerUpdated={onActivePeerUpdated} />);
    const expectedValue = 'error';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });

  describe('componentDidMount', () => {
    it('should be called once', () => {
      const actionSpy = spy(AccountComponent.prototype, 'componentDidMount');
      mount(<AccountComponent account={testAccount} peers={peers}
        onActivePeerUpdated={onActivePeerUpdated} />);
      expect(actionSpy).to.have.been.calledWith();
    });

    it('binds listener to beat event', () => {
      const actionSpy = spy(document, 'addEventListener');
      mount(<AccountComponent account={testAccount} peers={peers}
        onActivePeerUpdated={onActivePeerUpdated} />);
      expect(actionSpy).to.have.been.calledWith();
    });
  });
});
