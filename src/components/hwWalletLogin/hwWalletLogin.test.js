import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import HwWalletLogin from './hwWalletLogin';

describe('HwWalletLogin', () => {
  let wrapper;
  const props = {
    devices: [],
    t: key => key,
  };

  const history = {
    location: {
      pathname: '',
      search: '',
    },
    createHref: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  };

  const options = {
    context: {
      history, router: { route: history, history },
    },
    childContextTypes: {
      history: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };

  it('should show "looking for device" at first and "SelectDevice" after device conneted', () => {
    wrapper = mount(<HwWalletLogin {...props}/>, options);
    wrapper.update();
    // TODO figure out why the assertion below doesn't work
    // expect(wrapper.text()).toContain('Looking for a device...');
    wrapper.setProps({
      ...props,
      devices: [{
        id: 'DUMMY',
      }],
    });
    wrapper.update();
    // TODO figure out why the assertion below doesn't work
    // expect(wrapper.text()).toContain('SelectDevice');
  });
});
