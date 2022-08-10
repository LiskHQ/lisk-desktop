import React from 'react';
import { mount } from 'enzyme';
import networks from '@network/configuration/networks';
import * as delegatesApi from '@dpos/validator/api';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { getTransactionBaseFees, getTransactionFee, createGenericTx } from '@transaction/api';
import * as hwManager from '@transaction/utils/hwManager';
import wallets from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { mountWithProps } from 'src/utils/testHelpers';
import { act } from 'react-dom/test-utils';
import SelectNameAndFee from '.';

jest.mock('@network/utils/api');
jest.mock('@transaction/api');
jest.mock('@dpos/validator/api', () => ({
  getDelegate: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })),
}));
jest.mock('@transaction/utils/hwManager');

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;
const mockTransaction = {};
createGenericTx.mockResolvedValue(mockTransaction);
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
      selectedPriority: { title: 'Low', value: 156, selectedIndex: 0 },
      fees: {
        Transaction: '0.000156 LSK',
      },
      rawTx: {
        fee: 15600,
        moduleAssetId: '5:0',
        nonce: '1',
        sender: {
          publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
        },
        asset: {
          username: 'mydelegate',
        },
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
    const account = {
      ...props.account,
      summary: {
        ...props.account.summary,
        balance: 1e2,
      },
      token: { balance: 1e2 },
    };
    wrapper = mountWithProps(
      SelectNameAndFee,
      props,
      {
        wallet: { info: { LSK: account } },
      },
    );
    await flushPromises();
    act(() => {
      wrapper.update();
    });
    await flushPromises();
    // The feedback is shown bellow the amount input
    expect(wrapper.find('button.confirm-btn')).toBeDisabled();
  });
});
