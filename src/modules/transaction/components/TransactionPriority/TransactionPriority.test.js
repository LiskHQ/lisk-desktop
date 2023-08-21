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
    customFee: '165000',
    minFee: '165000',
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
    setCustomFee: jest.fn(),
    moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    loadError: false,
    isloading: false,
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

  it('renders custom fee option with input when props.token is lsk', () => {
    expect(wrapper).not.toContainMatchingElement('.custom-fee-input');
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper.find('.option-Custom').simulate('click');
    expect(props.setSelectedPriority).toHaveBeenCalledTimes(1);
    expect(wrapper).toContainMatchingElement('.custom-fee-input');
  });

  it('when typed in custom fee input, the custom fee cb is called', () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { value: '0.20' } });
    expect(props.setCustomFee).toHaveBeenCalledTimes(1);
  });

  it('hides the edit icon and shows the input when clicked in the "fee-value" element', async () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    // simulate blur so that the edit icon is shown
    wrapper.find('.custom-fee-input').at(1).simulate('blur');
    wrapper.find('span.fee-value-Transaction').simulate('click');

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
    expect(wrapper.find('.option-Custom')).toBeDisabled();
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
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { name: 'amount', value: '0.00005' } });
    expect(props.setCustomFee).toHaveBeenCalledWith({
      error: true,
      feedback: 'Fee must be greater than 0.00165 and less than 4990.',
      value: '165000',
    });
  });

  it('Should disable confirmation button when fee is less than the minimum', async () => {
    wrapper.setProps({
      ...props,
      token: mockToken,
      selectedPriority: 3,
      minFee: 1000,
    });
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { name: 'amount', value: '0.00000000001' } });
    expect(props.setCustomFee).toHaveBeenCalledWith({
      error: true,
      feedback: 'Maximum allowed decimal point is 8.',
      value: 1000,
    });
  });

  it('Should enable confirmation button when fee is within bounds', async () => {
    wrapper.setProps({ ...props, token: mockToken, selectedPriority: 3 });
    wrapper
      .find('.custom-fee-input')
      .at(1)
      .simulate('change', { target: { name: 'amount', value: '0.019' } });
    expect(props.setCustomFee).toHaveBeenCalledWith({
      error: false,
      feedback: '',
      value: '0.019',
    });
  });

  it('Should display the fee in loading state', async () => {
    wrapper.setProps({ ...props, isLoading: true });
    expect(wrapper.find('Spinner')).toBeTruthy();
  });
});
