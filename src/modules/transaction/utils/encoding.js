import { codec, cryptography } from '@liskhq/lisk-client';
import { trimBigintString } from './helpers';
import { joinModuleAndCommand } from './moduleCommand';

export const baseTransactionSchema = {
  $id: '/lisk/baseTransaction',
  type: 'object',
  required: ['module', 'command', 'nonce', 'fee', 'senderPublicKey', 'params'],
  properties: {
    module: {
      dataType: 'string',
      fieldNumber: 1,
    },
    command: {
      dataType: 'string',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    params: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

export const getCommandParamsSchema = (module, command, schema) => {
  const moduleCommand = joinModuleAndCommand({ module, command });
  const commandSchema = schema.find((meta) => meta.moduleCommand === moduleCommand);
  if (!(commandSchema && commandSchema.schema)) {
    throw new Error(`Module: ${module} Command: ${command} is not registered.`);
  }

  return commandSchema.schema;
};

export const decodeBaseTransaction = (encodedTransaction) =>
  codec.codec.decode(baseTransactionSchema, encodedTransaction);

export const decodeTransaction = (encodedTransaction, paramsSchema) => {
  const transaction = decodeBaseTransaction(encodedTransaction);
  const params = paramsSchema ? codec.codec.decode(paramsSchema, transaction.params) : {};
  const id = cryptography.utils.hash(encodedTransaction);
  return {
    ...transaction,
    params,
    id,
  };
};

export const encodeTransaction = (transaction, paramsSchema) => {
  let encodedParams;
  if (!Buffer.isBuffer(transaction.params)) {
    encodedParams = paramsSchema
      ? codec.codec.encode(paramsSchema, transaction.params)
      : Buffer.alloc(0);
  } else {
    encodedParams = transaction.params;
  }

  const decodedTransaction = codec.codec.encode(baseTransactionSchema, {
    ...transaction,
    params: encodedParams,
  });

  return decodedTransaction;
};

export const fromTransactionJSON = (transactionJSON, paramsSchema) => {
  transactionJSON = trimBigintString(transactionJSON);
  const tx = codec.codec.fromJSON(baseTransactionSchema, {
    ...transactionJSON,
    params: '',
  });

  let params;
  if (typeof transactionJSON.params === 'string') {
    params = paramsSchema
      ? codec.codec.decode(paramsSchema, Buffer.from(transactionJSON.params, 'hex'))
      : {};
  } else {
    params = paramsSchema ? codec.codec.fromJSON(paramsSchema, transactionJSON.params) : {};
  }

  return {
    ...tx,
    id: transactionJSON.id ? Buffer.from(transactionJSON.id, 'hex') : Buffer.alloc(0),
    params,
  };
};

export const toTransactionJSON = (transaction, paramsSchema) => {
  if (Buffer.isBuffer(transaction.params)) {
    return {
      ...codec.codec.toJSON(baseTransactionSchema, transaction),
      params: paramsSchema ? codec.codec.decodeJSON(paramsSchema, transaction.params) : {},
      id: transaction.id.toString('hex'),
    };
  }
  return {
    ...codec.codec.toJSON(baseTransactionSchema, {
      ...transaction,
      params: Buffer.alloc(0),
    }),
    params: paramsSchema ? codec.codec.toJSON(paramsSchema, transaction.params) : {},
    id: transaction.id && transaction.id.toString('hex'),
  };
};
