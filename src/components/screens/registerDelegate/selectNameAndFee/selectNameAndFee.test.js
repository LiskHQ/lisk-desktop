import React from 'react';
import { mount } from 'enzyme';
import networks from '@constants';
import SelectNameAndFee from './selectNameAndFee';
import * as delegatesApi from '../../../../utils/api/delegate';
import accounts from '../../../../../test/constants/accounts';
import { getTransactionBaseFees, getTransactionFee } from '../../../../utils/api/transaction';
import { fromRawLsk } from '../../../../utils/lsk';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

jest.mock('../../../../utils/api/network');
jest.mock('../../../../utils/api/transaction');
jest.mock('../../../../utils/api/delegate', () => ({
  getDelegate: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })),
}));

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;
getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
getTransactionFee.mockImplementation((params) => {
  const selectedTransactionPriority = params.selectedPriority.selectedIndex;
  const fees = fromRawLsk(
    Object.values(transactionBaseFees)[selectedTransactionPriority] * mockFeeFactor,
  );
  return ({
    value: fees, feedback: '', error: false,
  });
});

describe('SelectNameAndFee', () => {
  let wrapper;

  const props = {
    account: {
      ...accounts.genesis,
      delegate: {},
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
    // delegatesApi.getDelegate.mockReset();

    wrapper = mount(<SelectNameAndFee {...props} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly SelectName component', () => {
    expect(wrapper).toContainMatchingElement('.select-name-container');
    expect(wrapper).toContainMatchingElements(2, '.select-name-text-description');
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper).toContainMatchingElement('.feedback');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });

  it('type a valid and unused nickname', async () => {
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('input.select-name-input')
      .simulate('change', { target: { value: 'mydelegate' } });
    jest.advanceTimersByTime(1000);
    expect(delegatesApi.getDelegate).toHaveBeenCalledTimes(1);
    await flushPromises();
    wrapper.update();
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('button.confirm-btn').simulate('click');
    expect(props.nextStep).toBeCalled();
  });

  it('type an invalid nickname', () => {
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('input.select-name-input').simulate('change', { target: { value: 'mydelegate+' } });
    expect(delegatesApi.getDelegate).not.toBeCalled();
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

  it('disabled confirm button if nickname is longer than 20 chars', async () => {
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    wrapper.find('input.select-name-input').simulate('change', { target: { value: 'mydelegate' } });
    jest.advanceTimersByTime(1000);
    await flushPromises();
    wrapper.update();
    expect(wrapper.find('button.confirm-btn')).not.toBeDisabled();
    wrapper.find('input.select-name-input')
      .simulate('change', { target: { value: 'mydelegate_genesis_1023_gister_number_1' } });
    jest.advanceTimersByTime(1000);
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });
});
