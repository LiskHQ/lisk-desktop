import React from 'react';
import { shallow } from 'enzyme';
import DiscreetMode from './discreetMode';

describe('DiscreetMode Component', () => {
  let wrapper;

  const props = {
    token: 'LSK',
    account: {
      info: {
        LSK: { summary: { address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy' } },
      },
    },
    isDiscreetMode: true,
    location: {
      pathname: '/dashboard',
    },
    addresses: [],
  };

  const setup = (data) => shallow(<DiscreetMode {...data} />);

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
      addresses: [
        'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      ],
    };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper.find('div')).toHaveClassName('discreetMode');
  });

  it('should render properly with DiscreetMode ON in Other Wallet page but NO blur', () => {
    const newProps = {
      ...props,
      location: {
        pathname: '/explorer',
        search: '?address=lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
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
      addresses: [
        'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      ],
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
