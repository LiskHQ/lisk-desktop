import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { delegate } from '../../../../test/constants/accounts';
import DelegateTab from './delegateTab';

describe('Delegate Tab', () => {
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
    },
    account: delegate,
    t: v => v,
    nextForgers: {
      data: [{ username: delegate.username }],
    },
  };
  reactRedux.useSelector = jest.fn().mockImplementation(() => '2');

  beforeEach(() => {
    wrapper = mount(<DelegateTab {...props} />);
  });

  it('Should render active delegate with passed props', () => {
    expect(wrapper.find('.rank')).toIncludeText(props.delegate.data.rank);
    expect(wrapper.find('.delegate-since')).toIncludeText('24 May 2016');
    expect(wrapper.find('.vote')).toIncludeText('98,769,657 LSK');
    expect(wrapper.find('.approval')).toIncludeText(`${props.delegate.data.approval}%`);
    expect(wrapper.find('.productivity')).toIncludeText(`${props.delegate.data.productivity}%`);
    expect(wrapper.find('.blocks')).toIncludeText(`${props.delegate.data.producedBlocks} (${props.delegate.data.missedBlocks})`);
    expect(wrapper.find('.forged')).toIncludeText('1,405 LSK');
    expect(wrapper.find('.last-forged')).toIncludeText('24 May 16');
  });

  it.skip('Should render inactive delegate', () => {
    const newProps = {
      ...props,
      delegate: {
        data: {
          ...props.delegate.data,
          rank: 102,
        },
      },
    };
    wrapper = mount(<DelegateTab {...newProps} />);
    expect(wrapper.find('.status')).toIncludeText('Standby');
  });
});
