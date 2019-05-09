import * as bitcoin from 'bitcoinjs-lib';
import getBtcConfig from './api/btc/config';
import reg from './regex';
import { tokenMap } from '../constants/tokens';

/**
 * Validates the given address with respect to the tokenType
 * @param {String} tokenType
 * @param {String} address
 * @param {Number} [netCode=1]
 * @returns {Number} -> 0: valid, 1: invalid, -1: empty
 */
// eslint-disable-next-line import/prefer-default-export
export const validateAddress = (tokenType, address, netCode = 1) => {
  if (address === '') {
    return -1;
  }

  switch (tokenType) {
    // Reference: https://github.com/bitcoinjs/bitcoinjs-lib/issues/890
    case tokenMap.BTC.key:
      try {
        const config = getBtcConfig(netCode);
        bitcoin.address.fromBase58Check(address); // eliminates segwit addresses
        bitcoin.address.toOutputScript(address, config.network);
        return 0;
      } catch (e) {
        return 1;
      }

    case tokenMap.LSK.key:
    default:
      return reg.address.test(address) ? 0 : 1;
  }
};
