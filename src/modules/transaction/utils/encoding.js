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

export const getCommandParamsSchema = ({ module, command, schema }) => {
  const moduleCommand = module.concat(':', command);
  const commandSchema = schema.find(meta => meta.moduleCommand === moduleCommand);
  if (!commandSchema && !commandSchema.schema) {
    throw new Error(
      `Module: ${module} Command: ${command} is not registered.`,
    );
  }

  return commandSchema.schema;
};

export const decodeTransaction = (
  encodedTransaction,
  registeredSchema,
  metadata,
) => {
  const transaction = codec.decode(registeredSchema.transaction, encodedTransaction);
  const paramsSchema = getCommandParamsSchema(
    {
      module: transaction.module,
      command: transaction.command,
    },
    metadata,
  );
  const params = paramsSchema ? codec.decode(paramsSchema, transaction.params) : {};
  const id = utils.hash(encodedTransaction);
  return {
    ...transaction,
    params,
    id,
  };
};

export const encodeTransaction = (
  transaction,
  registeredSchema,
  metadata,
) => {
  let encodedParams;
  if (!Buffer.isBuffer(transaction.params)) {
    const paramsSchema = getCommandParamsSchema(
      {
        module: transaction.module,
        command: transaction.command,
      },
      metadata,
    );
    encodedParams = paramsSchema ? codec.encode(paramsSchema, transaction.params) : Buffer.alloc(0);
  } else {
    encodedParams = transaction.params;
  }

  const decodedTransaction = codec.encode(registeredSchema.transaction, {
    ...transaction,
    params: encodedParams,
  });

  return decodedTransaction;
};

export const fromTransactionJSON = (
  transaction,
  registeredSchema,
  metadata,
) => {
  const paramsSchema = getCommandParamsSchema(transaction, metadata);
  const tx = codec.fromJSON(registeredSchema.transaction, {
    ...transaction,
    params: '',
  });
  let params;
  if (typeof transaction.params === 'string') {
    params = paramsSchema
      ? codec.decode(paramsSchema, Buffer.from(transaction.params, 'hex'))
      : {};
  } else {
    params = paramsSchema ? codec.fromJSON(paramsSchema, transaction.params) : {};
  }

  return {
    ...tx,
    id: transaction.id ? Buffer.from(transaction.id, 'hex') : Buffer.alloc(0),
    params,
  };
};

export const toTransactionJSON = (
  transaction,
  registeredSchema,
  metadata,
) => {
  const paramsSchema = getCommandParamsSchema(
    {
      module: transaction.module,
      command: transaction.command,
    },
    metadata,
  );
  if (Buffer.isBuffer(transaction.params)) {
    return {
      ...codec.toJSON(registeredSchema.transaction, transaction),
      params: paramsSchema ? codec.decodeJSON(paramsSchema, transaction.params) : {},
      id: transaction.id.toString('hex'),
    };
  }
  return {
    ...codec.toJSON(registeredSchema.transaction, {
      ...transaction,
      params: Buffer.alloc(0),
    }),
    params: paramsSchema
      ? codec.toJSON(paramsSchema, transaction.params)
      : {},
    id: transaction.id.toString('hex'),
  };
};
