import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from '../../i18n';
import SignInTooltipWrapper from './signInTooltipWrapper';

describe('SignInTooltipWrapper', () => {
  const history = {
    location: {
      pathname: '/delegates/',
      search: '',
    },
  };
  const props = {
    children: <span></span>,
    t: key => key,
    history,
    router: { route: history, history },
  };

  const options = {
    context: {
      history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  it('should render Tooltip if no props.account', () => {
    const wrapper = mount(<Router><SignInTooltipWrapper {...props} /></Router>, options);
    expect(wrapper.find('Tooltip')).toHaveLength(1);
  });

  it('should not render Tooltip if props.account.info exists', () => {
    const account = {
      info: {
        LSK: { address: '16313739661670634666L' },
      },
    };
    const wrapper = mount(<Router>
        <SignInTooltipWrapper {...props} account={account} />
      </Router>, options);
    expect(wrapper.find('Tooltip')).toHaveLength(0);
    expect(wrapper.find('span')).toHaveLength(1);
  });
});
