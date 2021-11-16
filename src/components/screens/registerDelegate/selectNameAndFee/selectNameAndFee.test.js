import React from 'react';
import { mount } from 'enzyme';
import { networks } from '@constants';
import * as delegatesApi from '@api/delegate';
import { getTransactionBaseFees, getTransactionFee, create } from '@api/transaction';
import { fromRawLsk } from '@utils/lsk';
import * as hwManagerAPI from '@utils/hwManager';
import accounts from '../../../../../test/constants/accounts';
import SelectNameAndFee from './selectNameAndFee';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

jest.mock('@api/network');
jest.mock('@api/transaction');
jest.mock('@api/delegate', () => ({
  getDelegate: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })),
}));
jest.mock('@utils/hwManager');

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;
const mockTransaction = {};
create.mockResolvedValue(mockTransaction);
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

describe.skip('SelectNameAndFee', () => {
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
    wrapper = mount(<SelectNameAndFee {...props} />);
    hwManagerAPI.signTransactionByHW.mockResolvedValue({});
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
    await flushPromises();
    expect(props.nextStep).toBeCalledWith({
      nickname: 'mydelegate',
      transactionInfo: mockTransaction,
    });
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
