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
