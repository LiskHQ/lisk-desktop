import React from 'react';
import { mount } from 'enzyme';
import UnlockDevice from './unlockDevice';

jest.mock('../../utils/hwManager', () => ({
  checkIfInsideLiskApp: jest.fn(() => Promise.resolve()),
}));

describe('Unlock Device', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      devices: [
        { deviceId: 1, openApp: false, model: 'Ledger' },
        { deviceId: 2, openApp: true, model: 'Trezor' },
        { deviceId: 3, openApp: true, model: 'Ledger' },
      ],
      t: v => v,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      history: {
        push: jest.fn(),
      },
    };
  });

  it('Should render asking for opening app on Ledger', async (done) => {
    props.deviceId = 1;
    wrapper = mount(<UnlockDevice {...props} />);
    expect(props.nextStep).not.toBeCalled();
    // TODO refactor this as should be a better way to test it https://stackoverflow.com/a/43855794
    setImmediate(() => {
      wrapper.update();
      wrapper.find('button').simulate('click');
      expect(props.history.push).toBeCalled();
      done();
    });
  });

  it('Should call nextStep if openApp = true, or not Ledger', () => {
    props.deviceId = 2;
    wrapper = mount(<UnlockDevice {...props} />);
    expect(props.nextStep).toBeCalled();
    props.deviceId = 3;
    wrapper = mount(<UnlockDevice {...props} />);
    expect(props.nextStep).toBeCalled();
  });

  it('Should call nextStep after openApp is set to true', () => {
    const devices = [
      { deviceId: 1, openApp: true, model: 'Ledger' },
    ];
    props.deviceId = 1;
    wrapper = mount(<UnlockDevice {...props} />);
    wrapper.setProps({ devices });
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });

  it('Call prevStep if device disconnects', () => {
    props.deviceId = 1;
    wrapper = mount(<UnlockDevice {...props} />);
    wrapper.setProps({ devices: [] });
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });
});
