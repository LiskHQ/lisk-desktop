import {
  STANDARD_ERROR_MAP,
  INTERNAL_ERROR,
  RESERVED_ERROR_CODES,
  SERVER_ERROR_CODE_RANGE,
  SERVER_ERROR,
} from './error';

function getError(type) {
  if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) {
    return STANDARD_ERROR_MAP[INTERNAL_ERROR];
  }
  return STANDARD_ERROR_MAP[type];
}

function isReservedErrorCode(code) {
  return RESERVED_ERROR_CODES.includes(code);
}

function isServerErrorCode(code) {
  return code <= SERVER_ERROR_CODE_RANGE[0] && code >= SERVER_ERROR_CODE_RANGE[1];
}

function getErrorByCode(code) {
  const match = Object.values(STANDARD_ERROR_MAP).find((e) => e.code === code);
  if (!match) {
    return STANDARD_ERROR_MAP[INTERNAL_ERROR];
  }
  return match;
}

function formatErrorMessage(error) {
  if (typeof error === 'undefined') {
    return getError(INTERNAL_ERROR);
  }
  if (typeof error === 'string') {
    error = {
      ...getError(SERVER_ERROR),
      message: error,
    };
  }
  if (isReservedErrorCode(error.code)) {
    error = getErrorByCode(error.code);
  }
  if (!isServerErrorCode(error.code)) {
    throw new Error('Error code is not in server code range');
  }
  return error;
}

export const formatJsonRpcError = (id, error) => ({
  id,
  jsonrpc: '2.0',
  error: formatErrorMessage(error),
});

export const formatJsonRpcResult = (id, result) => ({
  id,
  jsonrpc: '2.0',
  result,
});
