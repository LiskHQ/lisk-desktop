import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import { delegate } from '../../../test/constants/accounts';
import DelegateTab from './delegateTab';

describe('Delegate Tab', () => {
  let wrapper;
  const props = {
    delegate: {
      account: delegate,
      approval: 98.63,
      missedBlocks: 10,
      producedBlocks: 304,
      productivity: 96.82,
      rank: 1,
      rewards: '140500000000',
      username: delegate.username,
      vote: '9876965713168313',
      lastBlock: { timestamp: 0 },
      txDelegateRegister: { timestamp: 0 },
    },
    t: v => v,
  };

  const options = {
    context: {
      i18n,
    },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<DelegateTab {...props} />, options);
  });

  it('Should render active delegate with passed props', () => {
    expect(wrapper.find('.rank')).toIncludeText(props.delegate.rank);
    expect(wrapper.find('.status')).toIncludeText('Active');
    expect(wrapper.find('.delegate-since')).toIncludeText('24 May 2016');
    expect(wrapper.find('.vote-weight')).toIncludeText('98,769,657.13168313 LSK');
    expect(wrapper.find('.approval')).toIncludeText(`${props.delegate.approval}%`);
    expect(wrapper.find('.productivity')).toIncludeText(`${props.delegate.productivity}%`);
    expect(wrapper.find('.blocks')).toIncludeText(`${props.delegate.producedBlocks} (${props.delegate.missedBlocks})`);
    expect(wrapper.find('.forged')).toIncludeText('1,405 LSK');
    expect(wrapper.find('.last-forged')).toIncludeText('3 years');
  });

  it('Should render inactive delegate', () => {
    const newProps = {
      ...props,
      delegate: {
        ...props.delegate,
        rank: 102,
      },
    };
    wrapper = mount(<DelegateTab {...newProps} />, options);
    expect(wrapper.find('.status')).toIncludeText('Standby');
  });
});
