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

import { codec as liskCode, cryptography  } from '@liskhq/lisk-client';
import { trimBigintString } from './helpers';
import { joinModuleAndCommand } from './moduleCommand';

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
  const moduleCommand = joinModuleAndCommand({ module, command });
  const commandSchema = schema.find((meta) => meta.moduleCommand === moduleCommand);
  if (!(commandSchema && commandSchema.schema)) {
    throw new Error(`Module: ${module} Command: ${command} is not registered.`);
  }

  return commandSchema.schema;
};

export const decodeBaseTransaction = (encodedTransaction) =>
liskCode.codec.decode(baseTransactionSchema, encodedTransaction);

export const decodeTransaction = (encodedTransaction, paramsSchema) => {
  const transaction = decodeBaseTransaction(encodedTransaction);
  const params = paramsSchema ? liskCode.codec.decode(paramsSchema, transaction.params) : {};
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
    encodedParams = paramsSchema ? liskCode.codec.encode(paramsSchema, transaction.params) : Buffer.alloc(0);
  } else {
    encodedParams = transaction.params;
  }

  const decodedTransaction = liskCode.codec.encode(baseTransactionSchema, {
    ...transaction,
    params: encodedParams,
  });

  return decodedTransaction;
};

export const fromTransactionJSON = (transactionJSON, paramsSchema) => {
  transactionJSON = trimBigintString(transactionJSON);
  const tx = liskCode.codec.fromJSON(baseTransactionSchema, {
    ...transactionJSON,
    params: '',
  });

  let params;
  if (typeof transactionJSON.params === 'string') {
    params = paramsSchema
      ? liskCode.codec.decode(paramsSchema, Buffer.from(transactionJSON.params, 'hex'))
      : {};
  } else {
    params = paramsSchema ? liskCode.codec.fromJSON(paramsSchema, transactionJSON.params) : {};
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
      ...liskCode.codec.toJSON(baseTransactionSchema, transaction),
      params: paramsSchema ? liskCode.codec.decodeJSON(paramsSchema, transaction.params) : {},
      id: transaction.id.toString('hex'),
    };
  }
  return {
    ...liskCode.codec.toJSON(baseTransactionSchema, {
      ...transaction,
      params: Buffer.alloc(0),
    }),
    params: paramsSchema ? liskCode.codec.toJSON(paramsSchema, transaction.params) : {},
    id: transaction.id && transaction.id.toString('hex'),
  };
};
