import { renderWithRouterAndStoreAndQueryClient } from 'src/utils/testHelpers';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { fireEvent, screen } from '@testing-library/react';
import TxBroadcasterWithStatus from './index';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@network/hooks/useCommandsSchema');

describe('TxBroadcasterWithStatus', () => {
  const signedTransaction = {
    module: 'pos',
    command: 'changeCommission',
    nonce: '11284145876061414261',
    fee: '27968742994614166',
    senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
    params: {
      newCommission: 1000,
    },
    signatures: [
      '7d9b5e60e311dc96b141d5137bd1ceac887b3fe865c5ef2208eeb019035427341734bf9be5e6640a0b4e29451754d4a7375271ffafcc5eb3a40347ecb1b46803',
    ],
  };
  const store = {
    wallet: accounts.genesis,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction,
    },
  };

  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('should show message for signed successfully', () => {
    renderWithRouterAndStoreAndQueryClient(TxBroadcasterWithStatus, {}, store);
    expect(screen.getByText('Your transaction is signed successfully.')).toBeTruthy();
  });

  it('should show message for error occurred while signing', () => {
    renderWithRouterAndStoreAndQueryClient(
      TxBroadcasterWithStatus,
      {},
      {
        ...store,
        transactions: {
          ...store,
          txSignatureError: signedTransaction,
          signedTransaction: null,
        },
      }
    );
    expect(
      screen.getByText('An error occurred while signing your transaction. Please try again.')
    ).toBeTruthy();
  });

  it('should show message for error occurred while broadcasting', () => {
    const prevStep = jest.fn();

    renderWithRouterAndStoreAndQueryClient(
      TxBroadcasterWithStatus,
      { prevStep },
      {
        ...store,
        transactions: {
          ...store,
          txBroadcastError: signedTransaction,
          txSignatureError: null,
          signedTransaction,
        },
      }
    );
    expect(
      screen.getByText(
        'An error occurred while sending your transaction to the network. Please try again.'
      )
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(prevStep).toHaveBeenCalled();
  });
});
