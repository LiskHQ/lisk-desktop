import React from 'react';
import { mount } from 'enzyme';
import SelectDevice from './selectDevice';

describe('Select Device', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      devices: [
        { deviceId: 1, model: 'Ledger Nano S', manufactor: 'Ledger' },
        { deviceId: 2, model: 'Trezor Model T', manufactor: 'Trezor' },
        { deviceId: 3, model: 'Ledger Nano X', manufactor: 'Ledger' },
      ],
      t: v => v,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
    };
  });

  it('Should render devices list with 3 wallets', () => {
    props.deviceId = 1;
    wrapper = mount(<SelectDevice {...props} />);
    expect(props.nextStep).not.toBeCalled();
    expect(wrapper).toContainMatchingElement('.hw-container');
    expect(wrapper).toContainMatchingElements(3, '.hw-device');
  });

  it('Should render devices list with 3 wallets and do click on a device for continue', () => {
    wrapper = mount(<SelectDevice {...props} />);
    expect(props.nextStep).not.toBeCalled();
    expect(wrapper).toContainMatchingElement('.hw-container');
    expect(wrapper).toContainMatchingElements(3, '.hw-device');
    wrapper.find('.hw-device-button').at(0).simulate('click');
    expect(props.nextStep).toBeCalledWith({ deviceId: 1 });
  });

  it('Should go to the next page if there is ONLY 1 connected device', () => {
    const newProps = { ...props, devices: [{ deviceId: 2, model: 'Trezor Model T', manufactor: 'Trezor' }] };
    wrapper = mount(<SelectDevice {...newProps} />);
    expect(props.nextStep).toBeCalledWith({ deviceId: 2 });
  });

  it('Should go to the prev page if the user disconnect all connected devices', () => {
    wrapper = mount(<SelectDevice {...props} />);
    expect(wrapper).toContainMatchingElements(3, '.hw-device');
    wrapper.setProps({ devices: [] });
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });
});
