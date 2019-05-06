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
  const store = configureMockStore([])({});
  const props = {
    devices: [],
    devicesListUpdated: jest.fn(),
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
    expect(props.devicesListUpdated).toBeCalledWith(devices);
  });
});
