import React from 'react';
import useSettings from '@settings/hooks/useSettings';
import { mount } from 'enzyme';
import Network from './networkName';

const mockState = {
  network: {
    name: 'testnet',
    status: { online: false },
  },
};

const mockDispatch = jest.fn();
const mockToggleSetting = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));
jest.mock('@settings/hooks/useSettings');

describe('Network', () => {
  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: mockToggleSetting,
  });

  it('renders status OFFLINE', () => {
    const wrapper = mount(<Network />);
    expect(wrapper.find('.online').exists()).toBe(false);
    expect(wrapper.find('.offline').exists()).toBe(true);
  });

  describe('Custom Node', () => {
    it('should show as connected to customNode', () => {
      useSettings.mockReturnValue({
        mainChainNetwork: { name: 'customNode' },
        toggleSetting: mockToggleSetting,
      });
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('customNode');
      // expect(wrapper.find('.network-address').text()).toBe('http://localhost:4000');
    });

    it.skip('should detect mainnet nethash', () => {
      useSettings.mockReturnValue({
        mainChainNetwork: { name: 'mainnet' },
        toggleSetting: mockToggleSetting,
      });
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('mainnet');
    });

    it.skip('should detect testnet nethash', () => {
      useSettings.mockReturnValue({
        mainChainNetwork: { name: 'testnet' },
        toggleSetting: mockToggleSetting,
      });
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('testnet');
    });
  });

  describe('Predefined Networks', () => {
    it('renders mainnet', () => {
      useSettings.mockReturnValue({
        mainChainNetwork: { name: 'mainnet' },
        toggleSetting: mockToggleSetting,
      });
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('mainnet');
    });

    it('renders testnet', () => {
      useSettings.mockReturnValue({
        mainChainNetwork: { name: 'testnet' },
        toggleSetting: mockToggleSetting,
      });
      const wrapper = mount(<Network />);
      expect(wrapper.find('.network-name').text()).toBe('testnet');
    });
  });
});
