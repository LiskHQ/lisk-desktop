import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { delegate, genesis } from '../../../../../test/constants/accounts';
import DelegateProfile from './delegateProfile';

describe('Delegate Profile', () => {
  let wrapper;
  const props = {
    delegate: {
      data: {
        account: delegate,
        approval: 98.63,
        missedBlocks: 10,
        producedBlocks: 304,
        productivity: 96.82,
        rank: 1,
        rewards: '140500000000',
        username: delegate.username,
        voteWeight: '9876965713168313',
        lastBlock: 0,
        txDelegateRegister: { timestamp: 0 },
      },
      loadData: jest.fn(),
    },
    voters: {
      data: {
        voters: [],
      },
      loadData: jest.fn(),
    },
    address: delegate.address,
    t: v => v,
  };
  reactRedux.useSelector = jest.fn().mockImplementation(() => '2');

  beforeEach(() => {
    wrapper = mount(<DelegateProfile {...props} />);
  });

  it.skip('Should render active delegate with passed props', () => {
    // expect(wrapper.find('.rank')).toIncludeText(props.delegate.data.rank);
    expect(wrapper.find('.productivity')).toIncludeText(`${props.delegate.data.productivity}%`);
    expect(wrapper.find('.blocks')).toIncludeText(`${props.delegate.data.producedBlocks} (${props.delegate.data.missedBlocks})`);
    expect(wrapper.find('.forged')).toIncludeText('1,405 LSK');
  });

  it.skip('Should render inactive delegate', () => {
    const newProps = {
      ...props,
      delegate: {
        ...props.delegate,
        data: {
          ...genesis,
          rank: 103,
        },
      },
    };
    wrapper = mount(<DelegateProfile {...newProps} />);
    expect(wrapper.find('.status').at(0)).toIncludeText('Standby');
  });
});
