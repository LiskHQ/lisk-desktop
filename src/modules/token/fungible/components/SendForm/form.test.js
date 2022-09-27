import { act } from 'react-dom/test-utils';
import { mountWithQueryClient } from 'src/utils/testHelpers';
import { tokenMap } from '@token/fungible/consts/tokens';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { useApplicationManagement, useCurrentApplication } from '@blockchainApplication/manage/hooks';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppTokens } from '@tests/fixtures/token';
import { useMessageField } from '../../hooks';
import Form from './SendForm';

const mockSetMessage = jest.fn();
const mockSetCurrentApplication = jest.fn();
const mockSetApplication = jest.fn();
const mockCurrentApplication = mockManagedApplications[0];

jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');

jest.mock('@transaction/hooks/useTransactionFeeCalculation', () => jest.fn().mockReturnValue({
  minFee: { value: 0.00001 },
  fee: { value: 0.0001 },
  maxAmount: { value: 200000000 },
}));

jest.mock('../../hooks');

describe('Form', () => {
  let props;
  let bookmarks;

  useApplicationManagement.mockReturnValue({
    setApplication: mockSetApplication,
    applications: mockManagedApplications,
  });

  useCurrentApplication.mockReturnValue([
    mockCurrentApplication,
    mockSetCurrentApplication,
  ]);

  useMessageField.mockImplementation(jest.requireActual('../../hooks').useMessageField);

  beforeEach(() => {
    bookmarks = {
      LSK: [{
        title: 'ABC',
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      }, {
        title: 'FRG',
        address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
      }, {
        title: 'KTG',
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      }],
    };

    props = {
      t: v => v,
      token: tokenMap.LSK.key,
      account: {
        ...accounts.genesis,
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
    const rawTx = {
      params: {
        recipient: {
          address, value: address, error: false, feedback: '', title: '',
        },
        amount: 1000000000,
        data: 'message',
      },
    };

    const wrapper = mountWithQueryClient(
      Form,
      {
        ...props,
        prevState: { rawTx },
      },
    );
    expect(wrapper.find('input.recipient')).toHaveValue(address);
    expect(wrapper.find('.amount input')).toHaveValue(fromRawLsk(rawTx.params.amount));
    expect(wrapper.find('textarea[name="reference"]')).toHaveValue(rawTx.params.data);
  });

  it('should go to next step when submit button is clicked', async () => {
    const wrapper = mountWithQueryClient(Form, props);
    const { address } = accounts.genesis.summary;
    wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
    wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '1' } });
    act(() => { jest.advanceTimersByTime(300); });

    act(() => { wrapper.update(); });
    await flushPromises();

    expect(wrapper.find('.confirm-btn').at(0)).not.toBeDisabled();
    wrapper.find('.confirm-btn').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalled();
  });

  describe('Recipient field', () => {
    it('should validate bookmark', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'recipient', value: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' } };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.feedback').at(0)).not.toHaveClassName('error');
    });

    it('should validate address', () => {
      const wrapper = mountWithQueryClient(
        Form,
          {
            ...props,
            bookmarks: { LSK: [] },
          },
      );
      const evt = { target: { name: 'recipient', value: 'invalid_address' } };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.feedback').at(1)).toHaveClassName('error');
    });

    it('Should show bookmark title if address is a bookmark', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const receipientEvt = { target: { name: 'recipient', value: bookmarks.LSK[0].address } };
      wrapper.find('input.recipient').simulate('change', receipientEvt);
      act(() => { jest.advanceTimersByTime(300); });
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
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField).toContainMatchingElement('.converted-price');
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: '.1' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('input').prop('value')).toEqual('0.1');
    });

    it('Should show error feedback if wrong data is inserted', async () => {
      const wrapper = mountWithQueryClient(Form, props);
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', { target: { name: 'amount', value: 'abc' } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      amountField.find('input[name="amount"]').simulate('change',
        { target: { name: 'amount', value: '1.1.' } });

      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      amountField.find('input').simulate('change', {
        target:
          { name: 'amount', value: props.account.token?.balance + 2 },
      });
      act(() => { jest.advanceTimersByTime(300); });
      await flushPromises();
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText(
        'Provided amount is higher than your current balance.',
      );
    });

    it('Should show error if transaction will result on an account with less than the minimum balance', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: '2.01' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText('Provided amount will result in a wallet with less than the minimum balance.');
      expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
    });

    it('Should show error if amount is negative', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const evt = { target: { name: 'amount', value: '-1' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText('Amount can\'t be negative.');
      expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
    });

    it('Should allow to send 0 LSK amount', () => {
      const wrapper = mountWithQueryClient(Form, props);
      const receipientEvt = { target: { name: 'recipient', value: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' } };
      wrapper.find('input.recipient').simulate('change', receipientEvt);
      const evt = { target: { name: 'amount', value: '0' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
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

      expect(fromChainDropdown.text()).toBe(mockCurrentApplication.name);
      expect(toChainDropdown.text()).toBe(mockCurrentApplication.name);
    });

    it('Should pre-populate the the dropdown fields', () => {
      props = {
        ...props,
        initialValue: {
          recipientApplication: mockManagedApplications[1].chainID,
          token: mockAppTokens[1].tokenID,
        },
      };
      const wrapper = mountWithQueryClient(Form, props);

      const fromChainDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(0);
      const toChainDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(1);
      const tokenDropdown = wrapper.find('div[data-testid="selected-menu-item"]').at(2);
      expect(fromChainDropdown.text()).toBe(mockCurrentApplication.name);
      expect(toChainDropdown.text()).toBe(mockManagedApplications[1].name);
      expect(tokenDropdown.text()).toBe(mockAppTokens[1].name);
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
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      referenceField = wrapper.find('.reference');
      expect(referenceField.find('.feedback.error')).toHaveClassName('show error');
    });

    it('Should remove the value of the message field', () => {
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
