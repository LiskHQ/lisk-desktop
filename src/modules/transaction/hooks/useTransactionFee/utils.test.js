import wallets from '@tests/constants/wallets';
import moduleCommandSchemas from '@tests/constants/schemas';
import { getParamsSchema } from './utils';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';

describe('getParamsSchema', () => {
  const transactionJSON = {
    nonce: '0',
    fee: '0',
    senderPublicKey: wallets.genesis.summary.publicKey,
    module: 'token',
    command: 'transfer',
    params: {
      tokenId: '00000000',
      amount: '1000000',
      recipientAddress: wallets.genesis.summary.address,
      data: '',
    },
    signatures: [],
  };

  it('Returns transaction param schema', () => {
    expect(getParamsSchema(transactionJSON, moduleCommandSchemas)).toEqual(
      moduleCommandSchemas[MODULE_COMMANDS_NAME_MAP.transfer]
    );
  });
});
