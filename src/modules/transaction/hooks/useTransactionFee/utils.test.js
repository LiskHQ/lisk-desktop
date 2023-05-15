import wallets from '@tests/constants/wallets';
import moduleCommandSchemas from '@tests/constants/schemas';
import { computeTransactionMinFee } from './utils';

const transactionBase = {
  nonce: 1,
  senderPublicKey: wallets.genesis.summary.publicKey,
};
const dummySignature = Buffer.alloc(64).toString('hex');

describe('computeTransactionMinFee', () => {
  it('Returns invalid fee if transaction is not valid', () => {
    expect(computeTransactionMinFee({}, null, 0, 0)).toEqual(BigInt(5000));
  });

  describe('Token transfer', () => {
    const tokenTransfer = {
      ...transactionBase,
      module: 'token',
      command: 'transfer',
      params: {
        tokenID: '0400000100000000',
        amount: '100000000',
        recipientAddress: wallets.genesis.summary.address,
        data: '',
      },
      signatures: [dummySignature],
    };
    const schema = moduleCommandSchemas['token:transfer'];

    it('Returns the calculated fee given transaction using a normal account is valid', () => {
      expect(computeTransactionMinFee(tokenTransfer, schema, 1, 0)).toEqual(BigInt(164000));
    });
  });

  describe('Register multisignature', () => {
    const registerMultisignature = {
      ...transactionBase,
      module: 'auth',
      command: 'registerMultisignature',
      params: {
        numberOfSignatures: 2,
        mandatoryKeys: [wallets.genesis.summary.publicKey, wallets.validator.summary.publicKey],
        optionalKeys: [],
        signatures: [dummySignature, dummySignature],
      },
      signatures: [dummySignature],
    };
    const schema = moduleCommandSchemas['auth:registerMultisignature'];

    it('Returns the calculated fee given multisig registration. transaction is valid', () => {
      expect(computeTransactionMinFee(registerMultisignature, schema, 1, 0)).toEqual(
        BigInt(341000)
      );
    });
  });

  describe('Multisignature', () => {
    const registerMultisignature = {
      ...transactionBase,
      module: 'token',
      command: 'transfer',
      params: {
        tokenID: '00000000',
        amount: '1000000',
        recipientAddress: wallets.genesis.summary.address,
        data: '',
      },
      signatures: [dummySignature, dummySignature],
    };
    const schema = moduleCommandSchemas['token:transfer'];

    it('Returns the calculated fee given transaction using a multisig is valid', () => {
      expect(computeTransactionMinFee(registerMultisignature, schema, 2, 0)).toEqual(
        BigInt(225000)
      );
    });
  });
});
