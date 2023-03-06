import React from 'react';
import { mount } from 'enzyme';
import * as hwManager from '@wallet/utils/hwManager';
import accounts from '@tests/constants/wallets';
import RequestPin from './requestPin';

jest.mock('@wallet/utils/hwManager');

function enterPinByButtons(wrapper, pinPositions) {
  pinPositions.split('').forEach((digit) => {
    wrapper.find('button.squareBtn').at(Number(digit)).simulate('click');
  });
}

describe.skip('Request PIN Component', () => {
  let wrapper;
  const deviceId = 4;
  const props = {
    devices: [
      { deviceId: 1, model: 'Ledger Nano S', manufactor: 'Ledger' },
      { deviceId: 2, model: 'Trezor Model T', manufactor: 'Trezor' },
      { deviceId: 3, model: 'Ledger Nano X', manufactor: 'Ledger' },
      { deviceId: 4, model: 'Trezor Model One', manufactor: 'Trezor' },
    ],
    t: v => v,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goBack: jest.fn(),
    deviceId,
  };
  const pin = '7951';
  const pinPositions = '0246';
  const publicKey = accounts.genesis.summary.publicKey;

  beforeEach(() => {
    wrapper = mount(<RequestPin {...props} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render RequestPin properly when selected device is Trezor One', () => {
    expect(wrapper).toContainMatchingElement('h1');
    expect(wrapper.find('a')).toHaveText('Official guidelines');
    expect(wrapper).toContainMatchingElement('input');
    expect(wrapper).toContainMatchingElements(9, 'button.squareBtn');
    expect(wrapper).toContainMatchingElement('button.primary-btn');
    expect(wrapper).toContainMatchingElement('button.tertiary-btn');
    expect(wrapper).not.toContainMatchingElement('Feedback.show');
  });

  it('Should go to next page if PIN is correct (get the public key)', async () => {
    hwManager.getPublicKey.mockResolvedValue(publicKey);
    hwManager.validatePin.mockResolvedValue(publicKey);
    enterPinByButtons(wrapper, pinPositions);
    wrapper.find('button.primary-btn').simulate('click');
    expect(hwManager.validatePin).toBeCalledWith({ pin, deviceId });
    wrapper.update();
    const PK = await hwManager.getPublicKey({ index: 0, deviceId });
    expect(PK).toEqual(publicKey);
    expect(props.nextStep).toBeCalled();
  });

  it('Should go to next page if correct PIN is entered by keyboard', async () => {
    hwManager.getPublicKey.mockResolvedValue(publicKey);
    hwManager.validatePin.mockResolvedValue(publicKey);

    wrapper.find('input.pin').simulate('change', { target: { value: pin } });
    wrapper.find('button.primary-btn').simulate('click');
    expect(hwManager.validatePin).toBeCalledWith({ pin, deviceId });
    wrapper.update();
    const PK = await hwManager.getPublicKey({ index: 0, deviceId });
    expect(PK).toEqual(publicKey);
    expect(props.nextStep).toBeCalled();
  });

  it('Should show error message if PIN is invalid', async () => {
    hwManager.getPublicKey.mockResolvedValue('');
    hwManager.validatePin.mockRejectedValue('Error');
    expect(wrapper).not.toContainMatchingElement('Feedback.show');
    enterPinByButtons(wrapper, pinPositions);
    wrapper.find('button.primary-btn').simulate('click');
    expect(hwManager.validatePin).toBeCalledWith({ pin, deviceId });
    const PK = await hwManager.getPublicKey({ index: 0, deviceId });
    expect(PK).toEqual('');
  });

  it('Should go to Sign In if do click in Go Back', () => {
    wrapper.find('button.tertiary-btn').simulate('click');
    expect(props.goBack).toBeCalled();
  });

  it('Should skip the page and go to next page', () => {
    const newProps = { ...props, deviceId: 2 };
    wrapper = mount(<RequestPin {...newProps} />);
    expect(newProps.nextStep).toBeCalled();
  });
});
