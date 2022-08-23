/**
* Chains
*/
export const LISK_MAINNET_CHAINS = {
  'lisk:1': {
    chainId: '1',
    name: 'Lisk',
    logo: '/chain-logos/lisk.png',
    rgb: '30, 240, 166',
    rpc: '',
  },
};

export const LISK_TEST_CHAINS = {
  'lisk:1': {
    chainId: '1',
    name: 'Lisk Testnet',
    logo: '/chain-logos/lisk.png',
    rgb: '30, 240, 166',
    rpc: '',
  },
};

export const LISK_CHAINS = { ...LISK_MAINNET_CHAINS, ...LISK_TEST_CHAINS };

/**
* Methods
*/
export const LISK_SIGNING_METHODS = {
  LISK_SIGN_TRANSACTION: 'lisk_signTransaction',
  LISK_SIGN_MESSAGE: 'lisk_signMessage',
};

export const PAIRING_PROPOSAL_STATUS = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const EVENTS = {
  SESSION_PROPOSAL: 'session_proposal',
  SESSION_REQUEST: 'session_request',
  SESSION_PING: 'session_ping',
  SESSION_EVENT: 'session_event',
  SESSION_UPDATE: 'session_update',
  SESSION_DELETE: 'session_delete',
};

export const ERROR_CASES = {
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  INVALID_METHOD: 'INVALID_METHOD',
  USER_REJECTED_METHODS: 'USER_REJECTED_METHODS',
};
