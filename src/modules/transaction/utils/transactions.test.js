import { codec as liskCodec, cryptography } from '@liskhq/lisk-client';
import { mockNetworkStatus } from '@network/__fixtures__';
import { mockAuth } from '@auth/__fixtures__';
import { mockCommandParametersSchemas } from '../../common/__fixtures__';

import {
  Transaction,
} from './transactions';
import {
  encodeTransaction,
  fromTransactionJSON,
  toTransactionJSON,
} from './encoding';

describe.skip('Transaction', () => {
  let tokenTransfer = new Transaction();
  const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
  const { privateKey, publicKey } = cryptography.legacy.getKeys(recoveryPhrase);
  const pubkey = publicKey.toString('hex');
  const module = 'token';
  const command = 'transfer';
  const encodedTransaction = '0a05746f6b656e12087472616e73666572180020a0fb0b2a20fd061b9146691f3c56504be051175d5b76d1b1d0179c5c4370e18534c588212232470a0800000002000000011080c2d72f1a1400b1182b317a82e4b9c4a54119ced29f19b496de22207765206861766520736f6d6520696e666f726d6174696f6e2069732068657265';
  const tokenTransferParams = {
    tokenID: '0000000200000001',
    amount: '100000000', // amount in beddows
    recipientAddress: '00b1182b317a82e4b9c4a54119ced29f19b496de',
    data: 'we have some information is here',
  };
  const transactionJSON = {
    command: 'transfer',
    fee: '196000',
    id: undefined,
    module: 'token',
    nonce: '0',
    params: {
      amount: '100000000',
      data: 'we have some information is here',
      recipientAddress: '00b1182b317a82e4b9c4a54119ced29f19b496de',
      tokenID: '0000000200000001',
    },
    senderPublicKey: '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184',
    signatures: [],
  };

  afterEach(() => {
    tokenTransfer = new Transaction();
  });

  describe('init', () => {
    it('should throw error when schema does not exists for module or command', () => {
      // Act
      expect(() => tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module: 'unknown',
        command: 'unknown',
      })).toThrow('');
    });

    it('should throw error when required params not given', () => {
      // Act
      expect(() => tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
      })).toThrow('');
    });

    it('should initialise the transaction for given module and command', () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module,
        command,
      });

      // Act
      expect(tokenTransfer.transaction).toMatchSnapshot();
    });

    it('should initialise encoded transaction', () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });

      // Act
      expect(tokenTransfer.transaction).toMatchSnapshot();
    });
  });

  describe('update', () => {
    it('should be able to update command params', () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });

      // Act
      const params = { ...tokenTransfer.transaction.params, data: 'updated message' };
      tokenTransfer.update({ params });
      expect(tokenTransfer.transaction.params.data).toEqual(params.data);
    });

    it('should be able to increment nonce', () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });

      // Act
      const nonce = 2;
      tokenTransfer.update({ nonce });
      expect(tokenTransfer.transaction.nonce).toEqual(BigInt(nonce));
    });
  });

  describe('sign', () => {
    it('should be able to sign encoded transaction', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module,
        command,
      });

      tokenTransfer.update({
        params: tokenTransferParams,
      });

      // // Act
      tokenTransfer.sign(privateKey);
      expect(tokenTransfer.transaction.signatures).toMatchSnapshot();
    });
  });

  describe('computeFee', () => {
    it('should return computed transaction fee', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module,
        command,
      });

      tokenTransfer.update({
        params: tokenTransferParams,
      });

      // Act
      expect(tokenTransfer.transaction.fee).toEqual(BigInt(196000));
      tokenTransfer.update({
        params: {
          ...tokenTransferParams,
          data: 'the fee should be updated based on data field bytes length',
        },
      });
      expect(tokenTransfer.transaction.fee).toEqual(BigInt(222000));
    });
  });

  describe('encode', () => {
    it('should be able to encode transaction', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module,
        command,
      });

      tokenTransfer.update({
        params: tokenTransferParams,
      });

      // Act
      expect(tokenTransfer.encode().toString('hex')).toMatchSnapshot();
    });

    it('should be able to encode transaction when params is buffer', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module,
        command,
      });

      tokenTransfer.transaction.params = Buffer.alloc(0);

      // Act
      expect(encodeTransaction(tokenTransfer.transaction).toString('hex')).toEqual('0a05746f6b656e12087472616e73666572180020c8d0072a200792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e971843200');
    });

    it('should allocate params empty buffer when schema is not available', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        module,
        command,
      });

      tokenTransfer.transaction.params = Buffer.alloc(0).toString('hex');

      // Act
      expect(encodeTransaction(tokenTransfer.transaction).toString('hex')).toEqual('0a05746f6b656e12087472616e73666572180020c8d0072a200792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e971843200');
    });
  });

  describe('decode', () => {
    it('should be able decode transaction', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });

      // Act
      expect(tokenTransfer.decode()).toMatchSnapshot();
    });
  });

  describe('toJSON', () => {
    it('should return transaction in json format', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });
      tokenTransfer.transaction.id = Buffer.alloc(10);

      // Act
      expect(tokenTransfer.toJSON()).toEqual({
        ...transactionJSON,
        id: tokenTransfer.transaction.id.toString('hex'),
      });
    });

    it('should decode encoded params as buffer', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });
      const encodedParams = liskCodec.codec.encode(
        tokenTransfer._paramsSchema,
        tokenTransfer.transaction.params,
      );
      tokenTransfer.transaction.params = encodedParams;
      tokenTransfer.transaction.id = Buffer.alloc(10).toString('hex');

      // Act
      expect(toTransactionJSON(
        tokenTransfer.transaction,
        tokenTransfer._paramsSchema,
      )).toMatchSnapshot();
    });
  });

  describe('fromJSON', () => {
    it('should return transaction object', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });

      // Act
      expect(tokenTransfer.fromJSON()).toEqual(
        fromTransactionJSON(transactionJSON, tokenTransfer._paramsSchema),
      );
    });

    it('should decode encoded params', async () => {
      // Arrange
      tokenTransfer.init({
        pubkey,
        networkStatus: mockNetworkStatus.data,
        auth: mockAuth.data,
        commandParametersSchemas: mockCommandParametersSchemas.data,
        encodedTransaction,
      });
      const encodedParams = liskCodec.codec.encode(
        tokenTransfer._paramsSchema,
        tokenTransfer.transaction.params,
      );
      const trxJSON = tokenTransfer.toJSON();
      trxJSON.params = encodedParams.toString('hex');
      trxJSON.id = Buffer.alloc(10).toString('hex');

      // Act
      expect(fromTransactionJSON(trxJSON, tokenTransfer._paramsSchema)).toMatchSnapshot();
    });
  });
});
