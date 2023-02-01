import { mountWithQueryClient } from 'src/utils/testHelpers';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import TxBroadcaster from './TxBroadcaster';
import Regular from '../Regular';
import Multisignature from '../Multisignature';

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@network/hooks/useCommandsSchema');

describe('TxBroadcaster', () => {
  const props = {
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        senderPublicKey: accounts.genesis.summary.publicKey,
        signatures: [accounts.genesis.summary.publicKey],
      },
    },
    account: accounts.genesis,
    network: {},
    transactionBroadcasted: jest.fn(),
    resetTransactionResult: jest.fn(),
    status: {
      code: txStatusTypes.signatureSuccess,
    },
    t: (t) => t,
    illustration: 'default',
    location: {
      search: '',
    },
  };

  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('should render Regular component with props', () => {
    const wrapper = mountWithQueryClient(TxBroadcaster, props);
    expect(wrapper.find(Regular)).toExist();
    expect(wrapper.find(Multisignature)).not.toExist();
  });

  it('should render Multisignature component with props', () => {
    const customProps = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: {
          senderPublicKey: accounts.multiSig.summary.publicKey,
          signatures: [accounts.multiSig.summary.publicKey, ''],
        },
      },
      account: accounts.multiSig,
    };
    const wrapper = mountWithQueryClient(TxBroadcaster, customProps);
    expect(wrapper.find(Multisignature)).toExist();
    expect(wrapper.find(Regular)).not.toExist();
  });
});
