import React from 'react';
import { mount } from 'enzyme';
import networks from '@network/configuration/networks';
import * as delegatesApi from '@dpos/utilities/api';
import { getTransactionBaseFees, getTransactionFee, create } from '@transaction/utilities/api';
import { fromRawLsk } from '@token/utilities/lsk';
import * as hwManager from '@transaction/utilities/hwManager';
import wallets from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import SelectNameAndFee from './form';

jest.mock('@network/utilities/api');
jest.mock('@transaction/utilities/api');
jest.mock('@dpos/utilities/api', () => ({
  getDelegate: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })),
}));
jest.mock('@transaction/utilities/hwManager');

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

describe('SelectNameAndFee', () => {
  let wrapper;

  const props = {
    account: {
      ...wallets.genesis,
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
    hwManager.signTransactionByHW.mockResolvedValue({});
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

  it('type a valid and unused username', async () => {
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
      rawTransaction: {
        fee: {
          error: false,
          feedback: '',
          value: '0.000156',
        },
        username: 'mydelegate',
      },
    });
  });

  it('type an invalid username', () => {
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

  it('disabled confirm button if username is longer than 20 chars', async () => {
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

  it('disabled confirm button if balance is not enough to pay fee', async () => {
    wrapper = mount(
      <SelectNameAndFee
        {...props}
        account={{
          ...props.account,
          token: { balance: 1e2 },
        }}
      />,
    );
    await flushPromises();
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    expect(wrapper.find('.feedback')).toHaveText('The minimum required balance to register is {{minBalance}} LSK');
  });
});
