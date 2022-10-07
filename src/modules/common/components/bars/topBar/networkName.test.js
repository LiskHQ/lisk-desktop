import React from 'react';
// import Lisk from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import Network from './networkName';

const mockState = {
  network: {
    name: 'testnet',
    status: { online: false },
  }
};

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));


describe('Network', () => {

  it('renders status OFFLINE', () => {
    const wrapper = mount(<Network />);
    expect(wrapper.find('.online').exists()).toBe(false);
    expect(wrapper.find('.offline').exists()).toBe(true);
  });

  describe('Custom Node', () => {
    it('should show as connected to customNode', () => {
      mockState.network.name = 'customNode'
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('customNode');
      // expect(wrapper.find('.network-address').text()).toBe('http://localhost:4000');
    });

    it.skip('should detect mainnet nethash', () => {
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('mainnet');
    });

    it.skip('should detect testnet nethash', () => {
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('testnet');
    });
  });

  describe('Predefined Networks', () => {
    it('renders mainnet', () => {
      mockState.network.name = 'mainnet'
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('mainnet');
    });

    it('renders testnet', () => {
      mockState.network.name = 'testnet'
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('testnet');
    });
  });
});
