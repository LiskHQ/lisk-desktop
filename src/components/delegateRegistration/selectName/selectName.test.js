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
    delegatesFetched: jest.fn(),
    nextStep: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    props.delegatesFetched.mockClear();
    debounce.mockReturnValue((name, error) => !error && props.delegatesFetched(name));
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
    expect(props.delegatesFetched).toBeCalled();
    wrapper.setProps({
      delegate: {
        delegateNameInvalid: false,
        delegateNameQueried: false,
      },
    });
    wrapper.update();
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('button.confirm-btn').simulate('click');
    expect(props.nextStep).toBeCalled();
  });

  it('type an invalid nickname', () => {
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate+' } });
    jest.advanceTimersByTime(1000);
    expect(props.delegatesFetched).not.toBeCalled();
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });
});
