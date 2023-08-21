import { act } from 'react-dom/test-utils';
import { mountWithQueryClient } from 'src/utils/testHelpers';
import { tokenMap } from '@token/fungible/consts/tokens';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { useCurrentAccount } from '@account/hooks';
import { mockAppTokens } from '@tests/fixtures/token';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTransactionEstimateFees } from '@transaction/hooks/queries/useTransactionEstimateFees';
import useSettings from '@settings/hooks/useSettings';
import { useAuth } from '@auth/hooks/queries/useAuth';
import * as transactionApi from '@transaction/api';
import {
  mockAppsTokens,
  mockTokensBalance,
  mockTokenSummary,
} from '@token/fungible/__fixtures__/mockTokens';
import { useBlockchainApplicationExplore } from '@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore';
import { mockBlockchainApp } from '@blockchainApplication/explore/__fixtures__';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { waitFor } from '@testing-library/react';
import useFiatRates from 'src/modules/common/hooks/useFiatRates';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import useMessageField from '../../hooks/useMessageField';
import Form from './SendForm';
import {
  useGetInitializationFees,
  useGetMinimumMessageFee,
  useTokenBalances,
  useTokenSummary,
} from '../../hooks/queries';
import { useTransferableTokens } from '../../hooks';

const mockSetMessage = jest.fn();
const mockSetCurrentApplication = jest.fn();
const mockSetAccount = jest.fn();
const mockSetApplication = jest.fn();
const mockToken = mockAppsTokens.data[0];
const mockCurrentApplication = mockManagedApplications[0];
const mockEstimateFeeResponse = {
  data: {
    transaction: {
      fee: {
        tokenID: '0400000000000000',
        minimum: '5104000',
      },
    },
  },
  meta: {
    breakdown: {
      fee: {
        minimum: {
          byteFee: '96000',
          additionalFees: {},
        },
      },
    },
  },
};

jest.mock('@transaction/hooks/queries/useTransactionEstimateFees');
jest.mock('@settings/hooks/useSettings');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@token/fungible/hooks/queries');
jest.mock('../../hooks');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore');
jest.mock('src/modules/common/hooks/useFiatRates');
jest.mock('@auth/hooks/queries/useAuth');
jest.spyOn(transactionApi, 'dryRunTransaction').mockResolvedValue([]);

describe('Form', () => {
  let props;
  let bookmarks;
  const availableBalance = '200000000'; // 2LSK

  useTokenBalances.mockReturnValue({ data: mockTokensBalance, isLoading: false, isSuccess: true });
  useTokenSummary.mockReturnValue({
    data: mockTokenSummary,
    isLoading: false,
    isSuccess: true,
  });
  useApplicationManagement.mockReturnValue({
    setApplication: mockSetApplication,
    applications: mockManagedApplications,
  });

  useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);
  useCurrentAccount.mockReturnValue([mockSavedAccounts[0], mockSetAccount]);
  useBlockchainApplicationExplore.mockReturnValue({ data: mockBlockchainApp, isSuccess: true });
  useBlockchainApplicationMeta.mockReturnValue({ data: mockBlockchainAppMeta, isSuccess: true });
  useTransferableTokens.mockReturnValue({
    data: mockAppsTokens.data.map((token) => ({
      ...token,
      availableBalance,
      tokenName: token.chainName,
      logo: { svg: '', png: '' },
    })),
    isSuccess: true,
    isLoading: false,
  });
  useGetInitializationFees.mockReturnValue({
    data: { data: { escrowAccount: 165000, userAccount: 165000 } },
  });
  useGetMinimumMessageFee.mockReturnValue({ data: { data: { fee: 5000000 } } });
  useFiatRates.mockReturnValue({ LSK: { USD: 1, EUR: 1 } });
  useTransactionEstimateFees.mockReturnValue({
    data: mockEstimateFeeResponse,
    isFetching: false,
    isFetched: true,
    error: false,
  });
  useAuth.mockReturnValue({ data: mockAuth });
  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: jest.fn(),
  });

  beforeEach(() => {
    bookmarks = {
      LSK: [
        {
          title: 'ABC',
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        },
        {
          title: 'FRG',
          address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        },
        {
          title: 'KTG',
          address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        },
      ],
    };

    props = {
      t: (v) => v,
      token: tokenMap.LSK.key,
      account: {
        ...accounts.genesis,
        summary: { balance: '200000000' },
        token: { balance: '200000000' },
      },
      bookmarks,
      nextStep: jest.fn(),
      initialValue: {},
    };
  });

  it('should render properly', () => {
    const wrapper = mountWithQueryClient(Form, props);
    expect(wrapper).toContainMatchingElement('span.recipient');
    expect(wrapper).toContainMatchingElement('span.amount');
    expect(wrapper).toContainMatchingElement('.add-message-button');
    expect(wrapper).not.toContainMatchingElement('PrimaryButton.btn-submit');
  });

  it('should render properly with data from prevState', () => {
    const { address } = accounts.genesis.summary;
    const formProps = {
      params: {
        recipient: {
          address,
          value: address,
          error: false,
          feedback: '',
          title: '',
        },
        amount: 20000000,
        data: 'message',
      },
    };

    const wrapper = mountWithQueryClient(Form, {
      ...props,
      prevState: { formProps },
    });
    expect(wrapper.find('input.recipient')).toHaveValue(address);
    expect(wrapper.find('.amount input')).toHaveValue(
      convertFromBaseDenom(formProps.params.amount, mockToken)
    );
    expect(wrapper.find('textarea[name="reference"]')).toHaveValue(formProps.params.data);
  });

  it('should go to next step when submit button is clicked', async () => {
    const wrapper = mountWithQueryClient(Form, props);
    const { address } = accounts.genesis.summary;
    wrapper
      .find('input.recipient')
      .simulate('change', { target: { name: 'recipient', value: address } });
    wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '1' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      wrapper.update();
    });
    await flushPromises();

    expect(wrapper.find('.confirm-btn').at(0)).not.toBeDisabled();
    wrapper.find('.confirm-btn').at(1).simulate('click');

    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalled();
    });
  });

  it('submit button should be disabled', async () => {
    const wrapper = mountWithQueryClient(Form, { ...props, account: {} });
    const { address } = accounts.genesis.summary;
    wrapper
      .find('input.recipient')
      .simulate('change', { target: { name: 'recipient', value: address } });
    wrapper
      .find('.amount input')
      .simulate('change', { target: { name: 'amount', value: '100000' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      wrapper.update();
    });
    await flushPromises();

    expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
  });

  describe('Recipient field', () => {
    it('should validate bookmark', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = {
        target: { name: 'recipient', value: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
      };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      expect(wrapper.find('.feedback').at(0)).not.toHaveClassName('error');
    });

    it('should validate address', () => {
      const wrapper = mountWithQueryClient(Form, {
        ...props,
        bookmarks: { LSK: [] },
      });
      const evt = { target: { name: 'recipient', value: 'invalid_address' } };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();

      expect(wrapper.find('.feedback').at(4)).toHaveClassName('error');
    });

    it('Should show bookmark title if address is a bookmark', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const receipentEvt = { target: { name: 'recipient', value: bookmarks.LSK[0].address } };
      wrapper.find('input.recipient').simulate('change', receipentEvt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      expect(wrapper.find('input.recipient')).toHaveValue(bookmarks.LSK[0].title);
    });
  });

  describe('Amount field', () => {
    it('Should show converter on correct input', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: 1 } };
      let amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField).not.toContainMatchingElement('.converted-price');

      amountField.find('input').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField).toContainMatchingElement('.converted-price');
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: '.1' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('input').prop('value')).toEqual('0.1');
    });

    it('Should show error feedback if wrong data is inserted', async () => {
      const wrapper = mountWithQueryClient(Form, props);
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', { target: { name: 'amount', value: 'abc' } });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      amountField
        .find('input[name="amount"]')
        .simulate('change', { target: { name: 'amount', value: '1.1.' } });

      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      amountField.find('input').simulate('change', {
        target: { name: 'amount', value: props.account.token?.balance + 2 },
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      await flushPromises();
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText(
        'Provided amount is higher than your current balance.'
      );
    });

    it('Should show error if transaction will result on an account with less than the minimum balance', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: '2' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText(
        'Provided amount will result in a wallet with less than the minimum balance.'
      );
      expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
    });

    it('Should show error if amount is negative', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: '-1' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText("Amount can't be negative.");
      expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
    });

    it('Should allow to send 0 LSK amount', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const recipient = {
        target: { name: 'recipient', value: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
      };
      wrapper.find('input.recipient').simulate('change', recipient);
      const evt = { target: { name: 'amount', value: '0' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);

      wrapper.find('.add-message-button').at(0).simulate('click');
      const referenceField = wrapper.find('.reference').at(0);
      const dat = {
        target: {
          name: 'reference',
          value: 'Lorem ipsum',
        },
      };
      referenceField.find('AutoResizeTextarea').simulate('focus');
      referenceField.find('AutoResizeTextarea').simulate('change', dat);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).not.toHaveText(expect.any(String));
      expect(wrapper.find('.confirm-btn').at(0)).not.toBeDisabled();
    });
  });

  describe('Dropdown fields', () => {
    it('Should pre-populate the from and to dropdown to the current application', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const fromChainDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(0);
      const toChainDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(1);

      expect(fromChainDropdown.text()).toBe(mockCurrentApplication.chainName);
      expect(toChainDropdown.text()).toBe(mockCurrentApplication.chainName);
    });

    it('Should pre-populate the dropdown fields', () => {
      props = {
        ...props,
        initialValue: {
          recipientApplication: mockManagedApplications[0].chainID,
          token: mockAppTokens[0].tokenID,
        },
      };
      const wrapper = mountWithQueryClient(Form, props);

      const fromChainDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(0);
      const toChainDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(1);
      const tokenDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(2);
      expect(fromChainDropdown.text()).toBe(mockCurrentApplication.chainName);
      expect(toChainDropdown.text()).toBe(mockManagedApplications[0].chainName);
      expect(tokenDropdown.text()).toBe(mockAppTokens[0].name);
    });
  });

  describe('Reference field', () => {
    it('Should show error feedback over limit of characters', () => {
      const wrapper = mountWithQueryClient(Form, props);
      wrapper.find('.add-message-button').at(0).simulate('click');

      let referenceField = wrapper.find('.reference').at(0);
      const evt = {
        target: {
          name: 'reference',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.',
        },
      };
      referenceField.find('AutoResizeTextarea').simulate('focus');
      referenceField.find('AutoResizeTextarea').simulate('change', evt);
      act(() => {
        jest.advanceTimersByTime(300);
      });
      wrapper.update();
      referenceField = wrapper.find('.reference');
      expect(referenceField.find('.feedback.error').at(1)).toHaveClassName('show error');
    });

    it.skip('Should remove the value of the message field', () => {
      // loop issue over the mock
      useMessageField.mockReturnValue([
        {
          error: false,
          value: 'test message',
          feedback: '54 bytes left',
          byteCount: 10,
        },
        mockSetMessage,
      ]);

      const wrapper = mountWithQueryClient(Form, props);
      wrapper.find('.reference button').at(0).simulate('click');
      expect(mockSetMessage).toHaveBeenCalled();
    });
  });
});
