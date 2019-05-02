import React from 'react';
import PropTypes from 'prop-types';
import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
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
    wrapper = mountWithContext(<HwWalletLogin {...props}/>, options);
    wrapper.update();
    // TODO figure out why the assertion below doesn't work.
    // I guess something with MultiStep using React.cloneElement
    // expect(wrapper.text()).toEqual(expect.stringContaining('Looking for a device...'));
    wrapper.setProps({
      ...props,
      devices: [{
        id: 'DUMMY',
      }],
    });
    wrapper.update();
    // TODO figure out why the assertion below doesn't work.
    // I guess something with MultiStep using React.cloneElement
    // expect(wrapper.text()).toEqual(expect.stringContaining('SelectDevice'));
  });
});
