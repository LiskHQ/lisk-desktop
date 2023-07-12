/* istanbul ignore file */
import { validator } from '@liskhq/lisk-client';
import { getSdkError } from '@walletconnect/utils';
import { decodeTransaction } from '@transaction/utils';
import { ERROR_CASES } from '../constants/lifeCycle';
import { formatJsonRpcError } from './jsonRPCFormat';

export const getRequestTransaction = (request) => {
  const { payload, schema } = request.request.params;
  try {
    validator.validator.validateSchema(schema);
    return decodeTransaction(Buffer.from(payload, 'hex'), schema);
  } catch (error) {
    throw new Error(error);
  }
};

export const rejectLiskRequest = (request) => {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError(ERROR_CASES.USER_REJECTED_METHODS).message);
};
