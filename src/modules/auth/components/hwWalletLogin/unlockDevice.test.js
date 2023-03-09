import React from 'react';
import { mount } from 'enzyme';
import UnlockDevice from './unlockDevice';

jest.mock('@wallet/utils/hwManager', () => ({
  checkIfInsideLiskApp: jest.fn(() => Promise.resolve()),
}));

describe('Unlock Device', () => {
  let wrapper;
  const props = {
    deviceId: 1,
    devices: [
      { deviceId: 1, model: 'Ledger' },
      { deviceId: 2, status: 'connected', model: 'Trezor' },
      { deviceId: 3, status: 'connected', model: 'Ledger' },
    ],
    t: (v, i) => v.replace('{{deviceModel}}', i ? i.deviceModel : ''),
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goBack: jest.fn(),
  };

  const setup = data => mount(<UnlockDevice {...data} />);

  beforeEach(() => {
    wrapper = setup(props);
  });

  it('Should render asking for opening app on Ledger', async () => {
    const html = wrapper.html();
    expect(html).toContain('Ledger connected! Open the Lisk app on the device');
  });

  it('Should call props.goback', async () => {
    wrapper.find('button').simulate('click');
    expect(props.goBack).toBeCalled();
  });

  it('Should call nextStep if openApp = true, or not Ledger', () => {
    wrapper = setup({ ...props, deviceId: 2 });
    expect(props.nextStep).toBeCalled();
    wrapper = setup({ ...props, deviceId: 3 });
    expect(props.nextStep).toBeCalled();
    wrapper.unmount();
  });

  it('Should call nextStep after openApp is set to true', () => {
    wrapper = setup({ ...props, devices: [{ deviceId: 1, openApp: true, model: 'Ledger' }] });
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });

  it('Call prevStep if device disconnects', () => {
    wrapper.setProps({ devices: [] });
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });
});
