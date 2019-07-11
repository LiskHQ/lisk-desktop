import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import Loading from './loading';

describe('HW Wallet -> Loading', () => {
  let wrapper;
  const props = {
    devices: [],
    nextStep: jest.fn(),
    t: key => key,
  };


  it('should show "looking for device" and call "nextStep" after device connected', () => {
    const devices = [
      { deviceId: 0, model: 'Ledger Nano S' },
      { deviceId: 1, model: 'Trezro Model T' },
    ];
    wrapper = mount(<Router><Loading {...props} /></Router>);
    expect(wrapper).toIncludeText('Looking for a device...');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        ...props,
        devices,
      }),
    });
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });
});
