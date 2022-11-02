/*
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

import { codec } from '@liskhq/lisk-codec';
import { utils } from '@liskhq/lisk-cryptography';

// TODO: Use from service endpoint/elements
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
  const moduleCommand = module.concat(':', command);
  const commandSchema = schema.find((meta) => meta.moduleCommand === moduleCommand);
  if (!(commandSchema && commandSchema.schema)) {
    throw new Error(`Module: ${module} Command: ${command} is not registered.`);
  }

  return commandSchema.schema;
};

export const decodeBaseTransaction = (encodedTransaction) =>
  codec.decode(baseTransactionSchema, encodedTransaction);

export const decodeTransaction = (encodedTransaction, paramsSchema) => {
  const transaction = decodeBaseTransaction(encodedTransaction);
  const params = paramsSchema ? codec.decode(paramsSchema, transaction.params) : {};
  const id = utils.hash(encodedTransaction);
  return {
    ...transaction,
    params,
    id,
  };
};

export const encodeTransaction = (transaction, paramsSchema) => {
  let encodedParams;
  if (!Buffer.isBuffer(transaction.params)) {
    encodedParams = paramsSchema ? codec.encode(paramsSchema, transaction.params) : Buffer.alloc(0);
  } else {
    encodedParams = transaction.params;
  }

  const decodedTransaction = codec.encode(baseTransactionSchema, {
    ...transaction,
    params: encodedParams,
  });

  return decodedTransaction;
};

export const fromTransactionJSON = (transactionJSON, paramsSchema) => {
  console.log(">>>>>>", transactionJSON)
  const tx = codec.fromJSON(baseTransactionSchema, {
    ...transactionJSON,
    params: '',
    nonce: transactionJSON.nonce.replace(/n$/, ''), // eslint-disable-next-line radix
    fee: transactionJSON.fee.toString().replace(/n$/, ''), // eslint-disable-next-line radix
  });

  console.log('---- tx: ', tx);

  let params;
  if (typeof transactionJSON.params === 'string') {
    params = paramsSchema
      ? codec.decode(paramsSchema, Buffer.from(transactionJSON.params, 'hex'))
      : {};
  } else {
    params = paramsSchema ? codec.fromJSON(paramsSchema, transactionJSON.params) : {};
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
      ...codec.toJSON(baseTransactionSchema, transaction),
      params: paramsSchema ? codec.decodeJSON(paramsSchema, transaction.params) : {},
      id: transaction.id.toString('hex'),
    };
  }
  return {
    ...codec.toJSON(baseTransactionSchema, {
      ...transaction,
      params: Buffer.alloc(0),
    }),
    params: paramsSchema ? codec.toJSON(paramsSchema, transaction.params) : {},
    id: transaction.id && transaction.id.toString('hex'),
  };
};
