import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Account from './index';

describe('<Account />', () => {
  let inputValue = {
    account: {
      isDelegate: false,
      address: '16313739661670634666L',
      username: 'lisk-nano',
    },
    address: '16313739661670634666L',
    peers: {
      online: true,
      active: {
        currentPeer: 'localhost',
        port: 4000,
        options: {
          name: 'Custom Node',
        },
      },
    },
    balance: '99992689.6',
  };
  it('there are 3 article tags inside it', () => {
    const wrapper = shallow(<Account {...inputValue} />);
    expect(wrapper.find('article')).to.have.lengthOf(3);
  });
  it('expect "status" to be online when peers.online is true', () => {
    const wrapper = shallow(<Account {...inputValue} />);
    const expectedValue = 'check';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });

  it('expect "status" to be online when peers.offline is false', () => {
    inputValue = {
      account: {
        isDelegate: false,
        address: '16313739661670634666L',
        username: 'lisk-nano',
      },
      address: '16313739661670634666L',
      peers: {
        online: false,
        active: {
          currentPeer: 'localhost',
          port: 4000,
          options: {
            name: 'Custom Node',
          },
        },
      },
      balance: '99992689.6',
    };
    const wrapper = shallow(<Account {...inputValue} />);
    const expectedValue = 'error';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });
});
