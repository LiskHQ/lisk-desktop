const PARSE_ERROR = 'PARSE_ERROR';
const INVALID_REQUEST = 'INVALID_REQUEST';
const METHOD_NOT_FOUND = 'METHOD_NOT_FOUND';
const INVALID_PARAMS = 'INVALID_PARAMS';
const INTERNAL_ERROR = 'INTERNAL_ERROR';
const SERVER_ERROR = 'SERVER_ERROR';

const RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
const SERVER_ERROR_CODE_RANGE = [-32000, -32099];

const STANDARD_ERROR_MAP = {
  [PARSE_ERROR]: { code: -32700, message: 'Parse error' },
  [INVALID_REQUEST]: { code: -32600, message: 'Invalid Request' },
  [METHOD_NOT_FOUND]: { code: -32601, message: 'Method not found' },
  [INVALID_PARAMS]: { code: -32602, message: 'Invalid params' },
  [INTERNAL_ERROR]: { code: -32603, message: 'Internal error' },
  [SERVER_ERROR]: { code: -32000, message: 'Server error' },
};

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
