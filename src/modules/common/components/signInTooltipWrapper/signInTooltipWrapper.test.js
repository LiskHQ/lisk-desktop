import React from 'react';
import { mount } from 'enzyme';
import SignInTooltipWrapper from './signInTooltipWrapper';

describe('SignInTooltipWrapper', () => {
  const history = {
    location: {
      pathname: '/validators/',
      search: '',
    },
  };
  const props = {
    children: <span />,
    t: key => key,
    history,
    router: { route: history, history },
  };

  it('should render Tooltip if no props.account', () => {
    const wrapper = mount(<SignInTooltipWrapper {...props} />);
    expect(wrapper.find('Tooltip')).toHaveLength(1);
  });

  it('should not render Tooltip if props.account.info exists', () => {
    const account = {
      info: {
        LSK: { address: '16313739661670634666L' },
      },
    };
    const wrapper = mount(<SignInTooltipWrapper {...props} account={account} />);
    expect(wrapper.find('Tooltip')).toHaveLength(0);
    expect(wrapper.find('span')).toHaveLength(1);
  });
});
