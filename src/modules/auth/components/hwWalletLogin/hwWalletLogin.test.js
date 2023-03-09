import React from 'react';
import { mount } from 'enzyme';
import HwWalletLogin from './hwWalletLogin';


const devices = [
  { deviceId: 1, manufacturer: 'Ledger' },
  { deviceId: 3, status: 'connected', manufacturer: 'Ledger' },
];

jest.mock('@wallet/utils/hwManager', () => ({
  subscribeToDevicesList: jest.fn().mockImplementation(fn => new Promise((resolve) => {
    fn(devices);
    resolve({
      unsubscribe: jest.fn(),
    });
  })),
}));

jest.mock('src/modules/hardwareWallet/manager/HWManager', () => ({
  getDevices: jest.fn().mockResolvedValue(devices),
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
    t: key => key,
  };

  it('should render Loading component', async () => {
    wrapper = mount(<HwWalletLogin {...props} />);
    expect(wrapper).toContainMatchingElement('Loading');
  });
});
