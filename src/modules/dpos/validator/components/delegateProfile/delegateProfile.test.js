import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import accounts from '@tests/constants/wallets';
import DelegateProfile from './delegateProfile';

const { genesis, delegate } = accounts;

describe('Delegate Profile', () => {
  let wrapper;
  const props = {
    delegate: {
      data: delegate,
      loadData: jest.fn(),
    },
    voters: {
      data: {
        voters: [],
      },
      loadData: jest.fn(),
    },
    address: delegate.address,
    t: (v) => v,
  };
  reactRedux.useSelector = jest.fn().mockImplementation(() => '2');

  beforeEach(() => {
    wrapper = mount(<DelegateProfile {...props} />);
  });

  it.skip('Should render active delegate with passed props', () => {
    // expect(wrapper.find('.rank')).toIncludeText(props.delegate.data.rank);
    expect(wrapper.find('.productivity')).toIncludeText(`${props.delegate.data.productivity}%`);
    expect(wrapper.find('.blocks')).toIncludeText(
      `${props.delegate.data.producedBlocks} (${props.delegate.data.missedBlocks})`
    );
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
