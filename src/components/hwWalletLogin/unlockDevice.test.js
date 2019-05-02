import React from 'react';
import { mount } from 'enzyme';
import UnlockDevice from './unlockDevice';

describe('Unlock Device', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      devices: [
        { deviceId: 1, openApp: false, model: 'Ledger' },
        { deviceId: 2, model: 'Trezor' },
        { deviceId: 3, openApp: true, model: 'Ledger' },
      ],
      t: v => v,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
    };
  });

  it('Should render asking for opening app on Ledger', () => {
    props.deviceId = 1;
    wrapper = mount(<div><UnlockDevice {...props} /></div>);
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('Should call nextStep if openApp = true, or not Ledger', () => {
    props.deviceId = 2;
    wrapper = mount(<UnlockDevice {...props} />);
    expect(props.nextStep).toBeCalled();
    props.deviceId = 3;
    wrapper = mount(<UnlockDevice {...props} />);
    expect(props.nextStep).toBeCalled();
  });
});
