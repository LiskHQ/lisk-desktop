import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { mockAuth } from '@auth/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import { useTransactionFee } from './useTransactionFee';

const bufferify = (string) => Buffer.from(string, 'hex');

const defaultPriorities = [
  { value: 0, title: 'Low' },
  { value: 1, title: 'Medium' },
  { value: 2, title: 'High' },
];
const transaction = {
  nonce: BigInt(0),
  senderPublicKey: Buffer.from(wallets.genesis.summary.publicKey, 'hex'),
  module: 'token',
  command: 'transfer',
  params: {
    tokenId: bufferify('00000000'),
    amount: BigInt('1000000'),
    recipientAddress: bufferify(wallets.genesis.summary.address),
    data: '',
  },
  signatures: [],
};

jest.mock('@auth/hooks/queries');
jest.mock('@network/hooks', () => ({
  useCommandSchema: jest.fn(() => ({
    moduleCommandSchemas: {
      "token:transfer": {
        $id: "/lisk/transferParams",
        title: "Transfer transaction params",
        type: "object",
        required: ["tokenID", "amount", "recipientAddress", "data"],
        properties: {
          tokenID: {
            dataType: "bytes",
            fieldNumber: 1,
            minLength: 8,
            maxLength: 8,
          },
          amount: {
            dataType: "uint64",
            fieldNumber: 2,
          },
          recipientAddress: {
            dataType: "bytes",
            fieldNumber: 3,
            format: "lisk32",
          },
          data: {
            dataType: "string",
            fieldNumber: 4,
            minLength: 0,
            maxLength: 64,
          },
        },
      },
    },
  })),
}));

describe('useTransactionFee', () => {
  it('Returns the calculated fee given transaction is valid', () => {
    useAuth.mockReturnValue({ data: mockAuth });
    const priorities = defaultPriorities.map((item) => ({ ...item, selected: item.title === 'Low' }));
    const { result } = renderHook(() => useTransactionFee({
      isValid: true,
      wallet: wallets.genesis.summary,
      priorities,
      transaction,
    }));

    expect(result.current).toEqual({
      total: BigInt('133000'),
      components: [
        { value: BigInt('133000'), type: 'bytesFee' },
      ],
    });
  });
});
