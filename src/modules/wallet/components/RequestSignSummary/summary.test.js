import { screen, fireEvent } from '@testing-library/react';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import { cryptography } from '@liskhq/lisk-client';
import wallets from '@tests/constants/wallets';
import { mockAuth } from '@auth/__fixtures__';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import Summary from './summary';

const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

jest.mock('src/utils/searchParams', () => ({
  ...jest.requireActual('src/utils/searchParams'),
  removeSearchParamsFromUrl: jest.fn(),
}));

jest.mock('@transaction/utils/transaction', () => ({
  getTransactionAmount: () => '1000000000',
}));
jest.mock('@transaction/hooks/useTxInitiatorAccount');

describe('RequestSignSummary', () => {
  const props = {
    t: (v) => v,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    actionFunction: jest.fn(),
    formProps: {},
    transactionJSON: {
      command: 'transfer',
      fee: '196000',
      module: 'token',
      nonce: '4987',
      params: {
        amount: '100000000',
        data: 'we have some information is here',
        recipientAddress: '00b1182b317a82e4b9c4a54119ced29f19b496de',
        tokenID: '0000000200000001',
      },
      senderPublicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      signatures: [],
    },
  };

  useTxInitiatorAccount.mockReturnValue({
    txInitiatorAccount: {
      ...mockAuth.data,
      ...mockAuth.meta,
      keys: {
        ...mockAuth.data,
        mandatoryKeys: wallets.multiSig.keys.mandatoryKeys,
        optionalKeys: wallets.multiSig.keys.optionalKeys,
      },
    },
    isLoading: false,
  });

  it('should render the transaction details correctly', () => {
    renderWithQueryClient(Summary, props);
    // Page titles
    expect(screen.getByText('Transaction summary')).toBeInTheDocument();
    expect(
      screen.getByText('Please review and verify the transaction details before signing.')
    ).toBeInTheDocument();
    // Transaction details
    expect(screen.getByText('token')).toBeInTheDocument();
    expect(screen.getByText('transfer')).toBeInTheDocument();
    expect(screen.getByText('196000')).toBeInTheDocument();
    expect(screen.getByText('4987')).toBeInTheDocument();
    Object.values(props.transactionJSON.params).forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('should call nextStep and prevStep with correct params', () => {
    renderWithQueryClient(Summary, props);

    fireEvent.click(screen.getByText('Sign'));
    expect(props.nextStep).toHaveBeenCalledWith({
      formProps: props.formProps,
      transactionJSON: props.transactionJSON,
      selectedPriority: 'normal',
      actionFunction: props.actionFunction,
    });
  });

  it('should call prevStep with correct params', () => {
    renderWithQueryClient(Summary, props);

    fireEvent.click(screen.getByText('Go back'));
    expect(props.prevStep).toHaveBeenCalledWith({ formProps: props.formProps });
  });
});
