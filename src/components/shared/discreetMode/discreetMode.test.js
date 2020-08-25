import React from 'react';
import { shallow } from 'enzyme';
import DiscreetMode from './discreetMode';

describe('DiscreetMode Component', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        LSK: { address: '16313739661670634666L' },
        BTC: { address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo' },
      },
    },
    isDiscreetMode: true,
    location: {
      pathname: '/dashboard',
    },
    addresses: [],
  };

  const setup = data => shallow(<DiscreetMode {...data} />);

  beforeEach(() => {
    wrapper = setup(props);
  });

  it('should render properly with DiscreetMode ON', () => {
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper.find('div')).toHaveClassName('discreetMode');
  });

  it('should render properly with DiscreetMode ON in Transaction Details page', () => {
    const newProps = {
      ...props,
      location: {
        pathname: '/explorer/transactions',
      },
      addresses: ['16313739661670634666L', '234324234L'],
    };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper.find('div')).toHaveClassName('discreetMode');
  });

  it('should render properly with DiscreetMode ON in Other Wallet page but NO blur', () => {
    const newProps = {
      ...props,
      location: {
        pathname: '/account',
        search: '?address=34234234L',
      },
      shouldEvaluateForOtherAccounts: true,
    };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper.find('div')).not.toHaveClassName('discreetMode');
  });

  it('should render properly with DiscreetMode ON in Other page', () => {
    const newProps = {
      ...props,
      location: {
        pathname: '/explorer/transactions',
      },
      addresses: ['16313739661670634666L', '234324234L'],
      shouldEvaluateForOtherAccounts: true,
    };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper.find('div')).toHaveClassName('discreetMode');
  });

  it('should render properly with DiscreetMode OFF', () => {
    const newProps = {
      ...props,
      isDiscreetMode: false,
    };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper.find('div')).not.toHaveClassName('discreetMode');
  });
});
