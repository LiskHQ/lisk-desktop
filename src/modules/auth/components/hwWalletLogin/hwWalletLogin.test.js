import React from 'react';
import { mount } from 'enzyme';
import * as hwManager from '@wallet/utils/hwManager';
import HwWalletLogin from './hwWalletLogin';

jest.mock('@wallet/utils/hwManager', () => ({
  subscribeToDevicesList: jest.fn().mockImplementation(
    (fn) =>
      new Promise((resolve) => {
        fn([
          { deviceId: 1, openApp: false, manufacturer: 'Ledger' },
          { deviceId: 2, manufacturer: 'Trezor' },
          { deviceId: 3, openApp: true, manufacturer: 'Ledger' },
        ]);
        resolve({
          unsubscribe: jest.fn(),
        });
      })
  ),
}));

describe('HwWalletLogin', () => {
  let wrapper;
  const props = {
    devices: [],
    settingsUpdated: jest.fn(),
    account: {
      address: '123456L',
      info: {
        LSK: {
          address: '123456L',
          balance: 100,
        },
      },
    },
    network: {
      name: 'Custom Node',
      status: { online: true },
      networks: {
        nodeUrl: 'http://localhost:4000',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
    },
    t: (key) => key,
  };

  it('should render Loading component and call hwManager.subscribeToDevicesList', async () => {
    wrapper = mount(<HwWalletLogin {...props} />);
    expect(hwManager.subscribeToDevicesList).toBeCalled();
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('Loading');
  });

  it('should unsubscribe from devices on unmount ', async () => {
    const unsubscribe = jest.fn();
    hwManager.subscribeToDevicesList.mockReturnValue({ unsubscribe });
    wrapper = mount(<HwWalletLogin {...props} />);
    wrapper.unmount();
    expect(unsubscribe).toBeCalled();
  });
});
