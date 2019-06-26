import React from 'react';
import debounce from 'lodash.debounce';
import { mount } from 'enzyme';
import SelectName from './SelectName';

jest.mock('lodash.debounce');

describe('DelegateRegistration', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        LSK: {
          address: '123456789L',
          balance: 11000,
        },
      },
      isDelegate: false,
    },
    prevState: {},
    delegate: {},
    network: {
      liskAPIClient: {
        delegates: {
          get: jest.fn(),
        },
        options: {
          name: 'Mainnet',
        },
      },
    },
    nextStep: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    props.liskAPIClient.delegates.get.mockClear();
    debounce.mockReturnValue((name, error) => !error && props.liskAPIClient.delegates.get(name));
    wrapper = mount(<SelectName {...props} />);
  });

  it('renders properly SelectName component', () => {
    expect(wrapper).toContainMatchingElement('.select-name-container');
    expect(wrapper).toContainMatchingElements(2, '.select-name-text-description');
    expect(wrapper).toContainMatchingElement('.learm-more-link');
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper).toContainMatchingElement('.input-feedback');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });

  it('type a valid and unused nickname', () => {
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate' } });
    jest.advanceTimersByTime(1000);
    expect(props.liskAPIClient.delegates.get).toBeCalled();
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('button.confirm-btn').simulate('click');
    expect(props.nextStep).toBeCalled();
  });

  it('type an invalid nickname', () => {
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate+' } });
    jest.advanceTimersByTime(1000);
    expect(props.liskAPIClient.delegates.get).not.toBeCalled();
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });

  it('disabled confirm button if user is already a delegate', () => {
    wrapper.setProps({
      account: {
        ...props.account,
        isDelegate: true,
      },
    });
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });

  it('disabled confirm button if nickname is longer than 20 chars', () => {
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate' } });
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate_genesis_1023_gister_number_1' } });
    jest.advanceTimersByTime(1000);
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });
});
