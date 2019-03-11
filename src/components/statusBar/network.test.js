import React from 'react';
import { mount } from 'enzyme';
import Network from './network';

describe('Network', () => {
  let wrapper;

  const data = {
    showNetworkIndicator: true,
    t: val => val,
    peers: {
      liskAPIClient: {},
      options: {
        code: 2,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
      status: {
        online: true,
      },
    },
  };

  const setup = props => mount(<Network {...props} />);

  beforeEach(() => {
    wrapper = setup(data);
  });

  it('renders status ONLINE', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders status OFFLINE', () => {
    data.peers.status.online = false;
    wrapper = setup(data);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders nethash option as DEVNET', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders nethash option as MAINNET', () => {
    const mainnet = 'ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511';
    data.peers.status.online = true;
    data.peers.options.nethash = mainnet;
    wrapper = setup(data);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders nethash option as TESTNET', () => {
    const testnet = 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba';
    data.peers.options.nethash = testnet;
    wrapper = setup(data);
    expect(wrapper).toMatchSnapshot();
  });

  it('not render a network', () => {
    data.showNetworkIndicator = false;
    data.peers.options.code = 0;
    wrapper = setup(data);
    expect(wrapper).toMatchSnapshot();
  });
});
