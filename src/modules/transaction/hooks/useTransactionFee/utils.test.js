import wallets from '@tests/constants/wallets';
import moduleCommandSchemas from '@tests/constants/schemas';
import { convertStringToBinary } from '@transaction/utils';
import { computeTransactionMinFee } from './utils';
import * as encodingUtils from '../../utils/encoding';

const transactionBase = {
  nonce: BigInt(0),
  senderPublicKey: Buffer.from(wallets.genesis.summary.publicKey, 'hex'),
};

jest.spyOn(encodingUtils, 'fromTransactionJSON').mockImplementation((tx) => tx);

describe('computeTransactionMinFee', () => {
  it('Returns invalid fee if transaction is not valid', () => {
    expect(computeTransactionMinFee({}, null, null, false)).toEqual(BigInt(72000));
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
    const schema = moduleCommandSchemas['token:transfer'];
    const auth = {
      numberOfSignatures: 1,
    };

    it('Returns the calculated fee given transaction using a normal account is valid', () => {
      expect(computeTransactionMinFee(tokenTransfer, schema, auth, true)).toEqual(BigInt(133001));
    });
  });

  describe('Register multisignature', () => {
    const registerMultisignature = {
      ...transactionBase,
      module: 'auth',
      command: 'registerMultisignature',
      params: {
        numberOfSignatures: 2,
        mandatoryKeys: [
          convertStringToBinary(wallets.genesis.summary.publicKey),
          convertStringToBinary(wallets.validator.summary.publicKey),
        ],
        optionalKeys: [],
        signatures: [],
      },
      signatures: [],
    };
    const schema = moduleCommandSchemas['auth:registerMultisignature'];
    const auth = {
      numberOfSignatures: 1,
    };

    it('Returns the calculated fee given multisig regi. transaction is valid', () => {
      expect(computeTransactionMinFee(registerMultisignature, schema, auth, true)).toEqual(
        BigInt(208001)
      );
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
    const schema = moduleCommandSchemas['token:transfer'];
    const auth = {
      numberOfSignatures: 1,
    };

    it('Returns the calculated fee given transaction using a multisig is valid', () => {
      expect(computeTransactionMinFee(registerMultisignature, schema, auth, true)).toEqual(
        BigInt(133001)
      );
    });
  });
});
