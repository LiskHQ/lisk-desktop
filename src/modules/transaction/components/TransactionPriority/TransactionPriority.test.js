import React from 'react';
import { waitFor } from '@testing-library/dom';
import { mount } from 'enzyme';
import { mockTokensBalance, mockAppsTokens } from '@token/fungible/__fixtures__';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import TransactionPriority from '.';

const baseFees = {
  Low: 100,
  Medium: 1000,
  High: 2000,
};
const tokenBalance = mockTokensBalance.data[0];
const mockToken = {
  ...tokenBalance,
  availableBalance: 500000000000,
  ...mockAppsTokens.data.filter((t) => t.tokenID === tokenBalance.tokenID)[0],
};

describe('TransactionPriority', () => {
  let wrapper;
  const fee = 0.123;

  const props = {
    t: (str) => str,
    customFee: { transactionFee: '165000', messageFee: 0 },
    computedMinimumFees: { transactionFee: '165000', messageFee: 0 },
    minRequiredBalance: '1000000000',
    token: mockToken,
    priorityOptions: [
      { title: 'Low', value: baseFees.Low },
      { title: 'Medium', value: baseFees.Medium },
      { title: 'High', value: baseFees.High },
      { title: 'Custom', value: baseFees.Low },
    ],
    selectedPriority: 0,
    setSelectedPriority: jest.fn(),
    fee,
    setCustomFee: jest.fn().mockImplementation((fn) => {
      fn();
    }),
    moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    loadError: false,
    isloading: false,
    formProps: { isFormValid: true },
    composedFees: [
      {
        title: 'Transaction',
        value: '0 LSK',
        components: [],
      },
      {
        title: 'Message',
        value: '0 LSK',
        isHidden: true,
        components: [],
      },
    ],
  };
  beforeEach(() => {
    props.setSelectedPriority.mockRestore();
    props.setCustomFee.mockRestore();
    wrapper = mount(<TransactionPriority {...props} />);
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('.transaction-priority');
    expect(wrapper).toContainMatchingElement('.priority-selector');
    expect(wrapper).toContainMatchingElement('.fee-container');
  });

  it('renders low, medium and high processing speed options', () => {
    expect(wrapper).toContainMatchingElement('.option-Low');
    expect(wrapper).toContainMatchingElement('.option-Medium');
    expect(wrapper).toContainMatchingElement('.option-High');
  });

  it('Does not render custom fee option with input when form is invalid', () => {
    props.setSelectedPriority.mockRestore();
    props.setCustomFee.mockRestore();
    wrapper = mount(<TransactionPriority {...props} formProps={{ isFormValid: false }} />);
    expect(wrapper).not.toContainMatchingElement('.custom-fee-input');
    expect(wrapper.find('.option-Custom')).toBeDisabled();
  });

  it('when typed in custom fee input, the custom fee cb is called', () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper.find('img[data-testid="edit-icon"]').at(0).simulate('click');
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { value: '0.20' } });
    expect(props.setCustomFee).toHaveBeenCalledTimes(1);
  });

  it('hides the edit icon and shows the input when clicked in the "fee-value" element', async () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper.find('img[data-testid="edit-icon"]').at(0).simulate('click');
    // simulate blur so that the edit icon is shown
    wrapper.find('.custom-fee-input').at(1).simulate('blur');
    wrapper.find('img[data-testid="edit-icon"]').at(0).simulate('click');

    await waitFor(() => {
      expect(wrapper).not.toContainMatchingElement('Icon[name="edit"]');
      expect(wrapper).toContainMatchingElement('.custom-fee-input');
    });
  });

  it('should disable button when fees are 0', () => {
    wrapper.setProps({
      ...props,
      token: mockToken,
      priorityOptions: [
        { title: 'Low', value: 0 },
        { title: 'Medium', value: 0 },
        { title: 'High', value: 0 },
        { title: 'Custom', value: 0 },
      ],
    });
    expect(wrapper.find('.option-Medium')).toBeDisabled();
    expect(wrapper.find('.option-High')).toBeDisabled();
    expect(wrapper.find('.option-Custom')).not.toBeDisabled();
  });

  it('Options buttons should be enabled/disabled correctly with loading lsk tx fee had an error', () => {
    wrapper.setProps({ ...props, token: mockToken, loadError: 'Error' });
    expect(wrapper.find('.option-Medium')).toBeDisabled();
    expect(wrapper.find('.option-High')).toBeDisabled();
    expect(wrapper.find('.option-Custom')).not.toBeDisabled();
    expect(wrapper.find('.option-Low')).not.toBeDisabled();
  });

  it('Should enable all priority options', () => {
    wrapper.setProps({ ...props, token: mockToken });
    expect(wrapper.find('.option-Low')).not.toBeDisabled();
    expect(wrapper.find('.option-Medium')).not.toBeDisabled();
    expect(wrapper.find('.option-High')).not.toBeDisabled();
    expect(wrapper.find('.option-Custom')).not.toBeDisabled();
  });

  it('Should disable confirmation button when fee is higher than hard cap', async () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper.find('img[data-testid="edit-icon"]').at(0).simulate('click');
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { name: 'amount', value: '0.00005' } });

    expect(props.setCustomFee).toHaveBeenCalled();
  });

  it('Should disable confirmation button when fee is less than the minimum', async () => {
    wrapper.setProps({
      ...props,
      token: mockToken,
      selectedPriority: 3,
      minFee: 1000,
    });
    wrapper.find('img[data-testid="edit-icon"]').at(0).simulate('click');
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { name: 'amount', value: '0.00000000001' } });
    expect(props.setCustomFee).toHaveBeenCalled();
  });

  it('Should enable confirmation button when fee is within bounds', async () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper.find('img[data-testid="edit-icon"]').at(0).simulate('click');
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { name: 'amount', value: '0.019' } });
    expect(props.setCustomFee).toHaveBeenCalled();
  });

  it('Should display the fee in loading state', async () => {
    wrapper.setProps({ ...props, isLoading: true });
    expect(wrapper.find('Spinner')).toBeTruthy();
  });
});
