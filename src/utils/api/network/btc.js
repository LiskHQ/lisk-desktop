import * as bitcoin from 'bitcoinjs-lib';
import { networkKeys } from '@constants';

/**
 * Defines the BTC testnet/mainnet network
 *
 * @param {Object} network - Selected network config
 * @param {String} network.name - Mainnet, or Testnet
 * @returns {Boolean} True if the network is mainnet, false for all others
 */
export const isMainnetBTC = network => (network.name === networkKeys.mainNet);

/**
 * Returns network config to use for future API calls.
 *
 * @param {Object} network
 * @param {String} network.name - Mainnet, or Testnet
 * @returns {Promise} A promise that resolves network config object
 * This method doesn't perform an async action, but it's a promise to
 * match the LSK getNetworkConfig function signature.
 */
export const getNetworkConfig = (network) => {
  const isMainnet = isMainnetBTC(network);
  const serviceUrl = !isMainnet ? 'https://btc-test.lisk.com' : 'https://btc.lisk.com';
  const btcNetwork = !isMainnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
  const derivationPath = !isMainnet ? "m/44'/1'/0'/0/0" : "m/44'/0'/0'/0/0";
  const transactionExplorerURL = `https://www.blockchain.com/${!isMainnet ? 'btctest' : 'btc'}/tx`;

  return new Promise(resolve =>
    resolve({
      serviceUrl,
      minerFeesURL: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
      network: btcNetwork,
      derivationPath,
      transactionExplorerURL,
    }));
};
