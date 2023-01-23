import wallets from "@tests/constants/wallets";
import moduleCommandSchemas from "@tests/constants/schemas";
import { convertStringToBinary } from '@transaction/utils';
import { computeTransactionMinFee } from "./utils";

const transactionBase = {
  nonce: BigInt(0),
  senderPublicKey: Buffer.from(wallets.genesis.summary.publicKey, 'hex'),
};
const defaultPriorities = [
  { value: 0, title: 'Low' },
  { value: 1, title: 'Medium' },
  { value: 2, title: 'High' },
];

describe('computeTransactionMinFee', () => {
  it('Returns zero if transaction is not valid', () => {
    expect(computeTransactionMinFee(null, null, null, null, false)).toEqual(BigInt(0));
  });

  describe('Normal account', () => {
    const tokenTransfer = {
      ...transactionBase,
      module: 'token',
      command: 'transfer',
      params: {
        tokenId: convertStringToBinary('00000000'),
        amount: BigInt('1000000'),
        recipientAddress: convertStringToBinary(wallets.genesis.summary.address),
        data: '',
      },
      signatures: [],
    };
    const schema = moduleCommandSchemas["token:transfer"];
    const auth = {
      numberOfSignatures: 1,
    };

    it('Returns the calculated fee given transaction is valid', () => {
      const priorities = defaultPriorities.map((item) => ({ ...item, selected: item.title === 'Low' }));
      expect(computeTransactionMinFee(tokenTransfer, schema, auth, priorities, true)).toEqual(BigInt(133000));
    });

    it('Returns the calculated fee with higher priority given the transaction is valid', () => {
      const priorities = defaultPriorities.map((item) => ({ ...item, selected: item.title === 'Medium' }));
      expect(computeTransactionMinFee(tokenTransfer, schema, auth, priorities, true)).toEqual(BigInt(133000));
    });
  });

  describe('Register multisignature', () => {
    const registerMultisignature = {
      ...transactionBase,
      module: 'auth',
      command: 'registerMultisignature',
      params: {
        numberOfSignatures: 2,
        mandatoryKeys: [convertStringToBinary(wallets.genesis.summary.publicKey), convertStringToBinary(wallets.validator.summary.publicKey)],
        optionalKeys: [],
        signatures: [],
      },
      signatures: [],
    };
    const schema = moduleCommandSchemas["auth:registerMultisignature"];
    const auth = {
      numberOfSignatures: 1,
    };

    it('Returns the calculated fee given transaction is valid', () => {
      const priorities = defaultPriorities.map((item) => ({ ...item, selected: item.title === 'Low' }));
      expect(computeTransactionMinFee(registerMultisignature, schema, auth, priorities, true)).toEqual(BigInt(275000));
    });
  });

  describe('Multisignature', () => {
    const registerMultisignature = {
      ...transactionBase,
      module: 'token',
      command: 'transfer',
      params: {
        tokenId: convertStringToBinary('00000000'),
        amount: BigInt('1000000'),
        recipientAddress: convertStringToBinary(wallets.genesis.summary.address),
        data: '',
      },
      signatures: [],
    };
    const schema = moduleCommandSchemas["token:transfer"];
    const auth = {
      numberOfSignatures: 1,
    };

    it('Returns the calculated fee given transaction is valid', () => {
      const priorities = defaultPriorities.map((item) => ({ ...item, selected: item.title === 'Low' }));
      expect(computeTransactionMinFee(registerMultisignature, schema, auth, priorities, true)).toEqual(BigInt(133000));
    });
  });
});
