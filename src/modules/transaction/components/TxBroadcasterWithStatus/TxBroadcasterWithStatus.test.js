import { renderWithRouterAndStoreAndQueryClient } from 'src/utils/testHelpers';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { screen } from '@testing-library/react';
import TxBroadcasterWithStatus from './index';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@network/hooks/useCommandsSchema');

describe('TxBroadcasterWithStatus', () => {
  const store = {
    wallet: accounts.genesis,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        senderPublicKey: accounts.genesis.summary.publicKey,
        signatures: [accounts.genesis.summary.publicKey],
      },
    },
  };

  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('should show "Transaction submitted" when txStatusTypes.broadcastSuccess ', () => {
    renderWithRouterAndStoreAndQueryClient(TxBroadcasterWithStatus, {}, store);
    expect(screen.getByText('Transaction submitted')).toBeTruthy();
  });
});
