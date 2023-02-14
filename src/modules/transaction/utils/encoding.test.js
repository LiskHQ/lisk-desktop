import * as keys from '@tests/constants/keys';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { cryptography, codec } from '@liskhq/lisk-client';
import {
  decodeTransaction,
  encodeTransaction,
  fromTransactionJSON,
  getCommandParamsSchema,
  toTransactionJSON,
} from './encoding';

jest.spyOn(codec.codec, 'decode');
jest.spyOn(codec.codec, 'toJSON');
jest.spyOn(codec.codec, 'decodeJSON');
jest.spyOn(codec.codec, 'encode');
jest.spyOn(cryptography.utils, 'hash');

describe('encoding', () => {
  const moduleCommandSchemas = mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  );

  it('should return schema of a particular moduleCommand', () => {
    const schema = [{ moduleCommand: 'token:transfer', schema: 'schema' }];
    expect(getCommandParamsSchema('token', 'transfer', schema)).toEqual('schema');
  });

  it('should throw and error', () => {
    const schema = [{ moduleCommand: 'legacy:reclaimLSK', schema: 'schema' }];

    expect(() => {
      getCommandParamsSchema('token', 'transfer', schema);
    }).toThrow(`Module: token Command: transfer is not registered.`);
  });

  it('should create tx from json when params is an object', () => {
    const transactionJSON = {
      fee: 0,
      module: 'pos',
      command: 'registerValidator',
      nonce: '1',
      params: {
        blsKey: keys.blsKey,
        generatorKey: keys.genKey,
        proofOfPossession: keys.pop,
        name: 'test',
      },
      signatures: [],
      senderPublicKey: '0x0',
    };

    expect(fromTransactionJSON(transactionJSON, moduleCommandSchemas)).toEqual({
      fee: 0n,
      module: 'pos',
      command: 'registerValidator',
      nonce: 1n,
      params: {},
      signatures: [],
      senderPublicKey: Buffer.alloc(0),
      id: Buffer.alloc(0),
    });
  });

  it('should create tx from json when params is a string', () => {
    codec.codec.decode.mockReturnValue('params-decoded');

    const transactionJSON = {
      fee: 0,
      module: 'pos',
      command: 'registerValidator',
      nonce: '1',
      params: '',
      signatures: [],
      senderPublicKey: '0x0',
    };

    expect(fromTransactionJSON(transactionJSON, moduleCommandSchemas)).toEqual({
      fee: 0n,
      module: 'pos',
      command: 'registerValidator',
      nonce: 1n,
      params: 'params-decoded',
      signatures: [],
      senderPublicKey: Buffer.alloc(0),
      id: Buffer.alloc(0),
    });
  });
  
  it('should create tx from json when no paramSchema is provided', () => {
    codec.codec.decode.mockReturnValue('params-decoded');

    const transactionJSON = {
      fee: 0,
      module: 'pos',
      command: 'registerValidator',
      nonce: '1',
      params: '',
      signatures: [],
      senderPublicKey: '0x0',
    };

    expect(fromTransactionJSON(transactionJSON)).toEqual({
      fee: 0n,
      module: 'pos',
      command: 'registerValidator',
      nonce: 1n,
      params: {},
      signatures: [],
      senderPublicKey: Buffer.alloc(0),
      id: Buffer.alloc(0),
    });
  });

  it('should create transaction whoose id is an empty buffer', () => {
    codec.codec.decode.mockReturnValue('params-decoded');

    const transactionJSON = {
      fee: 0,
      module: 'pos',
      command: 'registerValidator',
      nonce: '1',
      params: '',
      signatures: [],
      senderPublicKey: '0x0',
    };

    expect(fromTransactionJSON(transactionJSON)).toEqual({
      fee: 0n,
      module: 'pos',
      command: 'registerValidator',
      nonce: 1n,
      params: {},
      signatures: [],
      senderPublicKey: Buffer.alloc(0),
      id: Buffer.alloc(0),
    });
  });

  it('should create json from tx', () => {
    codec.codec.toJSON.mockReturnValue({ key: 'test-value' });
    codec.codec.decodeJSON.mockReturnValue({ key: 'test-params' });

    const transaction = {
      fee: '0n',
      module: 'pos',
      command: 'registerValidator',
      nonce: '1n',
      params: Buffer.from('params'),
      signatures: [],
      senderPublicKey: '0x0',
      id: '123456',
    };

    expect(toTransactionJSON(transaction, moduleCommandSchemas)).toEqual({
      key: 'test-value',
      params: { key: 'test-params' },
      id: '123456',
    });
  });

  it('should encode tx', () => {
    codec.codec.encode.mockReturnValue({ key: 'test-encoded' });

    const transaction = {
      fee: '0n',
      module: 'pos',
      command: 'registerValidator',
      nonce: '1n',
      params: Buffer.from('params'),
      signatures: [],
      senderPublicKey: '0x0',
      id: '123456',
    };

    expect(encodeTransaction(transaction, moduleCommandSchemas)).toEqual({ key: 'test-encoded' });
  });

  it('should encode tx with an empty buffer when paramSchema is not provided', () => {
    codec.codec.encode.mockReturnValue({});

    const transaction = {
      id: '123456',
    };

    expect(encodeTransaction(transaction)).toEqual({});
  });

  it('should decode tx with an empty object when paramSchema is not provided', () => {
    codec.codec.decode.mockReturnValue({
      nonce: '1n',
    });
    cryptography.utils.hash.mockReturnValue(Buffer.from('test-id'));

    expect(decodeTransaction(Buffer.alloc(0))).toEqual({
      id: Buffer.from('test-id'),
      params: {},
      nonce: '1n',
    });
  });
});
