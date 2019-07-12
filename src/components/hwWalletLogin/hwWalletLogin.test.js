import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import * as hwWalletUtils from '../../utils/hwWallet';
import HwWalletLogin from './hwWalletLogin';

jest.mock('../../utils/hwWallet');

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
  });
  const props = {
    devices: [],
    updateDeviceList: jest.fn(),
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
    t: key => key,
  };

  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
    },
  };

  it('Should render Loading component and call getDeviceList ', async () => {
    hwWalletUtils.getDeviceList.mockResolvedValue([
      { deviceId: 1, openApp: false, model: 'Ledger' },
      { deviceId: 2, model: 'Trezor' },
      { deviceId: 3, openApp: true, model: 'Ledger' },
    ]);

    wrapper = mount(<Router><HwWalletLogin {...props} /></Router>, options);
    const devices = await hwWalletUtils.getDeviceList();
    expect(wrapper).toContainMatchingElement('Loading');
    expect(props.updateDeviceList).toBeCalledWith(devices);
  });
});
