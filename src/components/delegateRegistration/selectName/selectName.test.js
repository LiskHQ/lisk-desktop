import React from 'react';
import debounce from 'lodash.debounce';
import { mount } from 'enzyme';
import SelectName from './SelectName';
import { getAPIClient } from '../../../utils/api/lsk/network';
import networks from '../../../constants/networks';
import accounts from '../../../../test/constants/accounts';

jest.mock('lodash.debounce');
jest.mock('../../../utils/api/lsk/network');

describe('DelegateRegistration', () => {
  let wrapper;
  let apiClient;

  const props = {
    account: {
      info: {
        LSK: {
          ...accounts.genesis,
        },
      },
    },
    prevState: {},
    network: {
      name: networks.mainnet.name,
      networks: {
        LSK: {},
      },
    },
    nextStep: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    apiClient = {
      delegates: {
        get: jest.fn(),
      },
    };

    apiClient.delegates.get.mockResolvedValue({ data: [] });
    getAPIClient.mockReturnValue(apiClient);
    debounce.mockImplementation(fn => fn);

    wrapper = mount(<SelectName {...props} />);
  });

  afterEach(() => {
    apiClient.delegates.get.mockClear();
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
    expect(apiClient.delegates.get).toBeCalled();
    // TODO investigate why even when the state is update, the test fails - in PR #2199
    wrapper.setState({ loading: false });
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('button.confirm-btn').simulate('click');
    expect(props.nextStep).toBeCalled();
  });

  it('type an invalid nickname', () => {
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate+' } });
    expect(apiClient.delegates.get).not.toBeCalled();
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
    // TODO investigate why even when the state is update, the test fails - in PR #2199
    wrapper.setState({ loading: false });
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('.select-name-input').at(0).simulate('change', { target: { value: 'mydelegate_genesis_1023_gister_number_1' } });
    jest.advanceTimersByTime(1000);
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });
});
