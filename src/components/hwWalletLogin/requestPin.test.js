import React from 'react';
import { mount } from 'enzyme';
// import { BrowserRouter as Router } from 'react-router-dom';
import * as hwManager from '../../utils/hwManager';
import RequestPin from './requestPin';

jest.mock('../../utils/hwManager');

describe('Request PIN Component', () => {
  let wrapper;
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
    history: {
      push: jest.fn(),
    },
    deviceId: 4,
  };

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
    hwManager.getPublicKey.mockResolvedValue('abc123');
    wrapper.find('button.squareBtn').at(0).simulate('click');
    wrapper.find('button.squareBtn').at(2).simulate('click');
    wrapper.find('button.squareBtn').at(4).simulate('click');
    wrapper.find('button.squareBtn').at(6).simulate('click');
    wrapper.find('button.primary-btn').simulate('click');
    expect(hwManager.validateTrezorOnePin).toBeCalled();
    wrapper.update();
    const PK = await hwManager.getPublicKey({ index: 0, deviceId: 4 });
    expect(PK).toEqual('abc123');
    expect(props.nextStep).toBeCalled();
  });

  it('Should show error message if PIN is invalid', async () => {
    hwManager.getPublicKey.mockResolvedValue('');
    expect(wrapper).not.toContainMatchingElement('Feedback.show');
    wrapper.find('button.squareBtn').at(0).simulate('click');
    wrapper.find('button.squareBtn').at(2).simulate('click');
    wrapper.find('button.squareBtn').at(4).simulate('click');
    wrapper.find('button.squareBtn').at(6).simulate('click');
    wrapper.find('button.primary-btn').simulate('click');
    expect(hwManager.validateTrezorOnePin).toBeCalled();
    const PK = await hwManager.getPublicKey({ index: 0, deviceId: 4 });
    expect(PK).toEqual('');
  });

  it('Should go to splashscreen if do click in Go Back', () => {
    wrapper.find('button.tertiary-btn').simulate('click');
    expect(props.history.push).toBeCalled();
  });

  it('Should skip the page and go to next page', () => {
    const newProps = { ...props, deviceId: 2 };
    wrapper = mount(<RequestPin {...newProps} />);
    expect(newProps.nextStep).toBeCalled();
  });
});
