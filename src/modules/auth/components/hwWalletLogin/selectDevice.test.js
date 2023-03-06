import React from 'react';
import { mount } from 'enzyme';
import SelectDevice from './selectDevice';

jest.mock('@hardwareWallet/manager/HWManager', () => ({
  selectDevice: jest.fn(),
}));

describe('Select Device', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      devices: [
        { deviceId: 1, model: 'Ledger Nano S', manufactor: 'Ledger' },
        { deviceId: 3, model: 'Ledger Nano X', manufactor: 'Ledger' },
      ],
      t: (v) => v,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
    };
  });

  it('Should render devices list with 3 wallets', () => {
    props.deviceId = 1;
    wrapper = mount(<SelectDevice {...props} />);
    expect(props.nextStep).not.toBeCalled();
    expect(wrapper).toContainMatchingElement('.hw-container');
    expect(wrapper).toContainMatchingElements(2, '.hw-device');
  });

  it('Should render devices list with 2 wallets and do click on a device for continue', async () => {
    wrapper = mount(<SelectDevice {...props} />);
    expect(props.nextStep).not.toBeCalled();
    expect(wrapper).toContainMatchingElement('.hw-container');
    expect(wrapper).toContainMatchingElements(2, '.hw-device');
    await wrapper.find('.hw-device-button').at(0).simulate('click');
    expect(props.nextStep).toBeCalledWith({ deviceId: 1 });
  });

  it('Should go to the prev page if the user disconnect all connected devices', () => {
    wrapper = mount(<SelectDevice {...props} />);
    expect(wrapper).toContainMatchingElements(2, '.hw-device');
    wrapper.setProps({ devices: [] });
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });
});
