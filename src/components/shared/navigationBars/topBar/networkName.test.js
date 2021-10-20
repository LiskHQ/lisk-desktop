import React from 'react';
// import Lisk from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import Network from './networkName';

describe('Network', () => {
  const t = val => val;
  const token = 'LSK';
  const customNodeHash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

  const network = {
    status: { online: true },
    name: 'customNode',
    networks: {
      LSK: {
        serviceUrl: 'http://localhost:4000',
        nethash: customNodeHash,
      },
    },
  };

  it('renders status OFFLINE', () => {
    const props = {
      t,
      token,
      network: {
        ...network,
        status: { online: false },
      },
    };
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find('.online').exists()).toBe(false);
    expect(wrapper.find('.offline').exists()).toBe(true);
  });

  describe('Custom Node', () => {
    it('should show as connected to devNet', () => {
      const props = {
        t,
        token,
        network,
      };
      const wrapper = mount(<Network {...props} />);
      expect(wrapper.find('.network-name').text()).toBe('devnet');
      expect(wrapper.find('.network-address').text()).toBe('http://localhost:4000');
    });

    it.skip('should detect mainnet nethash', () => {
      const props = {
        t,
        token,
        network: {
          name: 'customNode',
          status: { online: true },
          networks: {
            // LSK: {
            //   nethash: Lisk.constants.MAINNET_NETHASH,
            // },
          },
        },
      };
      const wrapper = mount(<Network {...props} />);
      expect(wrapper.find('.network-name').text()).toBe('mainnet');
    });

    it.skip('should detect testnet nethash', () => {
      const props = {
        t,
        token,
        network: {
          name: 'customNode',
          status: { online: true },
          networks: {
            // LSK: {
            //   nethash: Lisk.constants.TESTNET_NETHASH,
            // },
          },
        },
      };
      const wrapper = mount(<Network {...props} />);
      expect(wrapper.find('.network-name').text()).toBe('testnet');
    });
  });

  describe('Predefined Networks', () => {
    it('renders mainnet', () => {
      const props = {
        t,
        token,
        network: {
          name: 'mainnet',
          status: { online: true },
          networks: {
            // LSK: {
            //   nethash: Lisk.constants.MAINNET_NETHASH,
            // },
          },
        },
      };
      const wrapper = mount(<Network {...props} />);
      expect(wrapper.find('.network-name').text()).toBe('mainnet');
    });

    it('renders testnet', () => {
      const props = {
        t,
        token,
        network: {
          name: 'testnet',
          status: { online: true },
          networks: {
            // LSK: {
            //   nethash: Lisk.constants.TESTNET_NETHASH,
            // },
          },
        },
      };
      const wrapper = mount(<Network {...props} />);
      expect(wrapper.find('.network-name').text()).toBe('testnet');
    });
  });

  it('renders nethash option as TESTNET when BTC', () => {
    const props = {
      t,
      token: 'BTC',
      network: {
        name: 'customNode',
        status: { online: true },
        networks: {
          BTC: {
            nethash: customNodeHash,
            serviceUrl: 'http://localhost:8080',
          },
        },
      },
    };
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find('.network-name').text()).toBe('devnet');
    expect(wrapper.find('.network-address').text()).toBe('http://localhost:8080');
  });
});
