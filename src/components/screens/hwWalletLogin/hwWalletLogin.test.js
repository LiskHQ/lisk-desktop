import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import * as hwManager from '../../../utils/hwManager';
import HwWalletLogin from './hwWalletLogin';

jest.mock('../../utils/hwManager', () => ({
  subscribeToDevicesList: jest.fn((fn) => {
    const devices = [
      { deviceId: 1, openApp: false, model: 'Ledger' },
      { deviceId: 2, model: 'Trezor' },
      { deviceId: 3, openApp: true, model: 'Ledger' },
    ];
    setTimeout(() => fn(devices), 100);
  }),
}));

describe('HwWalletLogin', () => {
  let wrapper;
  const store = configureMockStore([])({
    account: {
      address: '123456L',
      info: {
        LSK: {
          address: '123456L',
          balance: 100,
        },
        BTC: {
          address: 'jhagsd676587',
          balance: 100,
        },
      },
    },
    settings: {
      token: {
        active: 'LSK',
        list: {
          LSK: true,
          BTC: true,
        },
      },
    },
    network: {
      name: 'Custom Node',
      status: { online: true },
      networks: {
        LSK: {
          nodeUrl: 'http://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    },
  });
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
        BTC: {
          address: 'jhagsd676587',
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

  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
    },
  };

  it('should render Loading component and call hwManager.subscribeToDevicesList ', async () => {
    wrapper = mount(<Router><HwWalletLogin {...props} /></Router>, options);
    expect(wrapper).toContainMatchingElement('Loading');
    expect(hwManager.subscribeToDevicesList).toBeCalled();
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('Loading');
  });

  it('should unsubscribe from devices on unmount ', async () => {
    const unsubscribe = jest.fn();
    hwManager.subscribeToDevicesList.mockReturnValue({ unsubscribe });
    wrapper = mount(<Router><HwWalletLogin {...props} /></Router>, options);
    wrapper.unmount();
    expect(unsubscribe).toBeCalled();
  });
});
