import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Network from './networkName';

describe('Network', () => {
  let wrapper;

  const data = {
    showNetworkIndicator: true,
    t: val => val,
    token: 'LSK',
    network: {
      status: { online: true },
      name: 'Custom Node',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    },
  };

  const setup = props => mount(<Network {...props} />);

  beforeEach(() => {
    wrapper = setup(data);
  });

  it('renders <Network /> component', () => {
    expect(wrapper.find('.wrapper')).to.have.length(1);
  });

  it('renders status ONLINE', () => {
    expect(wrapper.find('.online')).to.have.length(1);
    expect(wrapper.find('.offline')).to.have.length(0);
  });

  it('renders status OFFLINE', () => {
    data.network.status.online = false;
    wrapper = setup(data);
    expect(wrapper.find('.online')).to.have.length(0);
    expect(wrapper.find('.offline')).to.have.length(1);
  });

  it('renders nethash option as DEVENET', () => {
    expect(wrapper.find('p span').at(1)).to.have.text('Custom');
  });

  it('renders mainnet nethash option as DEVENET', () => {
    data.network.name = 'Custom Node';
    wrapper = setup(data);
    expect(wrapper.find('p span').at(1)).to.have.text('Custom');
  });

  it('renders testnete nethash option as DEVENET', () => {
    data.network.name = 'Custom Node';
    wrapper = setup(data);
    expect(wrapper.find('p span').at(1)).to.have.text('Custom');
  });

  it('renders nethash option as MAINNET', () => {
    data.network.name = 'Mainnet';
    wrapper = setup(data);
    expect(wrapper.find('p span').at(1)).to.have.text('Mainnet');
  });

  it('renders nethash option as TESTNET', () => {
    data.network.name = 'Testnet';
    wrapper = setup(data);
    expect(wrapper.find('p span').at(1)).to.have.text('Testnet');
  });

  it('not render a network', () => {
    data.showNetworkIndicator = false;
    data.network.name = 'Mainnet';
    wrapper = setup(data);
    expect(wrapper.find('.wrapper')).to.have.length(1);
    expect(wrapper.find('.status')).to.have.length(1);
  });

  it('renders nethash option as TESTNET when BTC', () => {
    data.token = 'BTC';
    data.network.name = 'Testnet';
    wrapper = setup(data);
    expect(wrapper.find('p span').at(1)).to.have.text('Testnet');
  });
});
