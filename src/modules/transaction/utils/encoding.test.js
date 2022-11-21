import * as keys from '@tests/constants/keys';
import { codec } from '@liskhq/lisk-codec';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import {
  encodeTransaction,
  fromTransactionJSON,
  getCommandParamsSchema,
  toTransactionJSON,
} from './encoding';

jest.spyOn(codec, 'decode');
jest.spyOn(codec, 'toJSON');
jest.spyOn(codec, 'decodeJSON');
jest.spyOn(codec, 'encode');

describe('encoding', () => {
  const moduleCommandSchemas = mockCommandParametersSchemas.data.reduce(
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
      module: 'dpos',
      command: 'registerDelegate',
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
      module: 'dpos',
      command: 'registerDelegate',
      nonce: 1n,
      params: {},
      signatures: [],
      senderPublicKey: Buffer.alloc(0),
      id: Buffer.alloc(0),
    });
  });

  it('should create tx from json when params is a string', () => {
    codec.decode.mockReturnValue('params-decoded');

    const transactionJSON = {
      fee: 0,
      module: 'dpos',
      command: 'registerDelegate',
      nonce: '1',
      params: '',
      signatures: [],
      senderPublicKey: '0x0',
    };

    expect(fromTransactionJSON(transactionJSON, moduleCommandSchemas)).toEqual({
      fee: 0n,
      module: 'dpos',
      command: 'registerDelegate',
      nonce: 1n,
      params: 'params-decoded',
      signatures: [],
      senderPublicKey: Buffer.alloc(0),
      id: Buffer.alloc(0),
    });
  });

  it('should create json from tx', () => {
    codec.toJSON.mockReturnValue({ key: 'test-value' });
    codec.decodeJSON.mockReturnValue({ key: 'test-params' });

    const transaction = {
      fee: '0n',
      module: 'dpos',
      command: 'registerDelegate',
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
    codec.encode.mockReturnValue({ key: 'test-encoded' });

    const transaction = {
      fee: '0n',
      module: 'dpos',
      command: 'registerDelegate',
      nonce: '1n',
      params: Buffer.from('params'),
      signatures: [],
      senderPublicKey: '0x0',
      id: '123456',
    };

    expect(encodeTransaction(transaction, moduleCommandSchemas)).toEqual({ key: 'test-encoded' });
  });
});
