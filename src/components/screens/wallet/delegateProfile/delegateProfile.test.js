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
        vote: '9876965713168313',
        lastBlock: 0,
        txDelegateRegister: { timestamp: 0 },
      },
      loadData: jest.fn(),
    },
    txDelegateRegister: {
      data: 131429610,
      loadData: jest.fn(),
    },
    lastBlock: {
      data: 131429610,
      loadData: jest.fn(),
    },
    address: delegate.address,
    t: v => v,
    nextForgers: {
      data: [{ username: delegate.username }],
    },
  };
  reactRedux.useSelector = jest.fn().mockImplementation(() => '2');

  beforeEach(() => {
    wrapper = mount(<DelegateProfile {...props} />);
  });

  it('Should render active delegate with passed props', () => {
    expect(wrapper.find('.rank')).toIncludeText(props.delegate.data.rank);
    expect(wrapper.find('.delegate-since')).toIncludeText('Delegate since23 Jul 2020');
    expect(wrapper.find('.vote')).toIncludeText('98,769,657 LSK');
    expect(wrapper.find('.approval')).toIncludeText(`${props.delegate.data.approval}%`);
    expect(wrapper.find('.productivity')).toIncludeText(`${props.delegate.data.productivity}%`);
    expect(wrapper.find('.blocks')).toIncludeText(`${props.delegate.data.producedBlocks} (${props.delegate.data.missedBlocks})`);
    expect(wrapper.find('.forged')).toIncludeText('1,405 LSK');
    expect(wrapper.find('.last-forged')).toIncludeText('Last Forged Block23 Jul 2020');
  });

  it('Should render inactive delegate', () => {
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
